// Convert a PACS .xls/.xlsx sheet into JSON at server/data/pacs.json
// Usage: node scripts/import-pacs.js "C:\\Users\\Admin\\Downloads\\covered_pacs_state_wise_09-08-25_11_33.xls"
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const src = process.argv[2];
if (!src) {
  console.error('ERROR: Please pass path to the PACS .xls file.');
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error('ERROR: File not found:', src);
  process.exit(2);
}

const wb = xlsx.readFile(src);
// Heuristic: pick first sheet
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(ws, { defval: '' });

// Try to detect headers in common formats
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
}

// Map potential header keys
const headerMap = {};
const first = rows[0] || {};
Object.keys(first).forEach((k) => {
  const nk = norm(k);
  headerMap[nk] = k;
});

function get(row, keys) {
  for (const k of keys) {
    const hk = headerMap[k];
    if (hk && row[hk]) return String(row[hk]).trim();
  }
  return '';
}

const out = [];
for (const row of rows) {
  const district = get(row, ['district', 'zila', 'dist']);
  const block = get(row, ['block', 'kshetra', 'tehsil_block']);
  const name = get(row, ['pacs_name', 'society_name', 'name']);
  const contact = get(row, ['contact', 'phone', 'mobile', 'contact_no']);
  if (!name) continue;
  out.push({
    id: 'pacs_' + Buffer.from(`${district}:${block}:${name}`).toString('base64').replace(/=+$/g, ''),
    name,
    district,
    block,
    contact,
  });
}

const destDir = path.join(process.cwd(), 'data');
const dest = path.join(destDir, 'pacs.json');
fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${out.length} records to`, dest);
