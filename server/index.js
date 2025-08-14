import express from 'express';
import cors from 'cors';
import { customAlphabet } from 'nanoid';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

// In-memory data stores (replace with DB later)
const db = {
  users: new Map(),
  pacs: [],
  requests: [],
  schemes: [{ id: 'pm-kisan', title: 'PM Kisan Samman Nidhi' }],
  procurements: [],
  slots: new Map(), // key: yyyy-mm-dd => { '09:00': numberBooked, ... }
};

// In-memory OTP store
const otps = new Map(); // key: phone, value: { code, exp }

app.get('/health', (_, res) => res.json({ ok: true }));

// Load PACS dataset if present
function tryLoadPacs() {
  const p = path.join(process.cwd(), 'data', 'pacs.json');
  if (fs.existsSync(p)) {
    try { db.pacs = JSON.parse(fs.readFileSync(p, 'utf-8')); }
    catch { db.pacs = []; }
  }
}
tryLoadPacs();

app.get('/pacs', (req, res) => {
  const { district, block, q } = req.query;
  let list = db.pacs;
  if (district) list = list.filter(p => (p.district || '').toLowerCase() === String(district).toLowerCase());
  if (block) list = list.filter(p => (p.block || '').toLowerCase() === String(block).toLowerCase());
  if (q) list = list.filter(p => p.name.toLowerCase().includes(String(q).toLowerCase()));
  res.json(list);
});

app.post('/auth/send-otp', (req, res) => {
  const { phone } = req.body || {};
  if (!/^\d{10}$/.test(phone || '')) return res.status(400).json({ error: 'invalid phone' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const exp = Date.now() + 5 * 60 * 1000; // 5 minutes
  otps.set(phone, { code, exp });
  // For demo, return the code in response (in production, integrate SMS)
  res.json({ ok: true, code, ttl: 300 });
});

app.post('/auth/verify-otp', (req, res) => {
  const { phone, code } = req.body || {};
  const entry = otps.get(phone);
  if (!entry) return res.status(400).json({ error: 'otp_not_sent' });
  if (Date.now() > entry.exp) return res.status(400).json({ error: 'otp_expired' });
  if (entry.code !== String(code)) return res.status(400).json({ error: 'otp_invalid' });
  otps.delete(phone);
  let uid = null;
  // Ensure a user record exists
  for (const [k, v] of db.users.entries()) {
    if (v && v.phone === phone) { uid = v.uid; break; }
  }
  if (!uid) {
    uid = 'U' + nanoid();
    db.users.set(uid, { uid, phone });
  }
  const token = 'T' + nanoid();
  res.json({ ok: true, uid, token });
});

app.post('/users', (req, res) => {
  const u = req.body;
  if (!u || !u.uid) return res.status(400).json({ error: 'uid required' });
  db.users.set(u.uid, u);
  res.json({ ok: true });
});

app.get('/users/:uid', (req, res) => {
  const u = db.users.get(req.params.uid);
  if (!u) return res.status(404).json({ error: 'not_found' });
  res.json(u);
});

app.post('/requests', (req, res) => {
  const { type, userId, item, qty, preferredDate } = req.body || {};
  if (!type || !userId) return res.status(400).json({ error: 'missing fields' });
  const id = 'REQ' + nanoid();
  const rec = { id, type, userId, item, qty, preferredDate, status: 'queued', createdAt: Date.now() };
  db.requests.push(rec);
  res.json(rec);
});

// Fertilizer request convenience route
app.post('/fertilizer-requests', (req, res) => {
  const { userId, items, qty } = req.body || {};
  if (!userId || !Array.isArray(items) || !qty) return res.status(400).json({ error: 'missing fields' });
  const id = 'FREQ' + nanoid();
  const rec = { id, type: 'fertilizer', userId, items, qty, status: 'queued', createdAt: Date.now() };
  db.requests.push(rec);
  res.json(rec);
});

app.get('/schemes/eligible', (req, res) => {
  // Demo: return all
  res.json(db.schemes);
});

// Slot availability: 1-hour slots 09:00-17:00, capacity 20 each
const SLOT_HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const SLOT_CAP = 20;

function normDate(d) {
  // expect yyyy-mm-dd
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return null;
  return d;
}

function getDayRecord(date) {
  if (!db.slots.has(date)) {
    const rec = {};
    for (const h of SLOT_HOURS) rec[h] = 0;
    db.slots.set(date, rec);
  }
  return db.slots.get(date);
}

app.get('/slots', (req, res) => {
  const { date } = req.query;
  const d = normDate(String(date || ''));
  if (!d) return res.status(400).json({ error: 'invalid_date' });
  const rec = getDayRecord(d);
  const availability = SLOT_HOURS.map(h => ({ hour: h, remaining: Math.max(0, SLOT_CAP - (rec[h] || 0)) }));
  res.json({ date: d, availability });
});

app.post('/slots/book', (req, res) => {
  const { date, hour, qty = 1 } = req.body || {};
  const d = normDate(String(date || ''));
  if (!d || !SLOT_HOURS.includes(hour)) return res.status(400).json({ error: 'invalid_input' });
  const rec = getDayRecord(d);
  const booked = rec[hour] || 0;
  if (booked + qty > SLOT_CAP) return res.status(409).json({ error: 'sold_out', remaining: Math.max(0, SLOT_CAP - booked) });
  rec[hour] = booked + qty;
  res.json({ ok: true, date: d, hour, remaining: SLOT_CAP - rec[hour] });
});

// Districts/Blocks/Tehsils endpoints (read from assets)
function loadJSON(rel) {
  const p = path.join(process.cwd(), '..', 'assets', 'data', rel);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
const blocks = loadJSON('up-blocks.json');
let tehsils = {};
try { tehsils = loadJSON('up-tehsils.json'); } catch { tehsils = {}; }

app.get('/districts', (req, res) => {
  res.json(Object.keys(blocks));
});

app.get('/blocks', (req, res) => {
  const { district } = req.query;
  if (!district) return res.status(400).json({ error: 'district required' });
  const list = blocks[String(district).toLowerCase()];
  if (!list) return res.status(404).json({ error: 'not_found' });
  res.json(list);
});

app.get('/tehsils', (req, res) => {
  const { district } = req.query;
  if (!district) return res.status(400).json({ error: 'district required' });
  const list = tehsils[String(district).toLowerCase()];
  if (!list) return res.status(404).json({ error: 'not_found' });
  res.json(list);
});

// Procurement records by user
app.get('/procurements', (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'uid required' });
  const list = db.requests.filter(r => r.type === 'procurement' && r.userId === uid);
  res.json(list);
});

// Admin routes
app.get('/admin/requests', (_, res) => res.json(db.requests));
app.get('/admin/users', (_, res) => res.json(Array.from(db.users.values())));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on http://localhost:' + port));
