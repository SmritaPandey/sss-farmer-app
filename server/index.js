import express from 'express';
import cors from 'cors';
import { customAlphabet } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

// In-memory data stores (replace with DB later)
const db = {
  users: new Map(),
  pacs: [
    { id: 'pacs_kashipur_2', name: 'Kashipur No. II Primary Agriculture Society Ltd.' },
    { id: 'pacs_doiwala', name: 'Doiwala Primary Agriculture Society' },
  ],
  requests: [],
  schemes: [{ id: 'pm-kisan', title: 'PM Kisan Samman Nidhi' }],
};

// In-memory OTP store
const otps = new Map(); // key: phone, value: { code, exp }

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/pacs', (req, res) => {
  const { district } = req.query;
  // For demo, ignore district and return all
  res.json(db.pacs);
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

app.post('/requests', (req, res) => {
  const { type, userId, item, qty, preferredDate } = req.body || {};
  if (!type || !userId) return res.status(400).json({ error: 'missing fields' });
  const id = 'REQ' + nanoid();
  const rec = { id, type, userId, item, qty, preferredDate, status: 'queued', createdAt: Date.now() };
  db.requests.push(rec);
  res.json(rec);
});

app.get('/schemes/eligible', (req, res) => {
  // Demo: return all
  res.json(db.schemes);
});

// Admin routes
app.get('/admin/requests', (_, res) => res.json(db.requests));
app.get('/admin/users', (_, res) => res.json(Array.from(db.users.values())));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on http://localhost:' + port));
