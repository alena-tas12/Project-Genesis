import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import Database from 'better-sqlite3';
import express from 'express';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { mkdirSync } from 'node:fs';

const port = Number(process.env.PORT || 8787);
const jwtSecret = process.env.JWT_SECRET || 'replace-this-before-deployment';
mkdirSync('data', { recursive: true });
const db = new Database('data/mospi-platform.db');
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, filename TEXT NOT NULL, mime_type TEXT NOT NULL, extracted_text TEXT NOT NULL, uploaded_by INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS assessments (id INTEGER PRIMARY KEY, document_id INTEGER, questions_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', reviewed_by INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_events (id INTEGER PRIMARY KEY, actor_id INTEGER, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id INTEGER, metadata_json TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
if (!db.prepare('SELECT id FROM users WHERE email = ?').get('admin@local.mospi')) {
  db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run('admin@local.mospi', bcrypt.hashSync('ChangeMe!26101', 12), 'admin');
}
const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const audit = (actor, action, entityType, entityId, metadata = {}) => db.prepare('INSERT INTO audit_events (actor_id, action, entity_type, entity_id, metadata_json) VALUES (?, ?, ?, ?, ?)').run(actor?.id ?? null, action, entityType, entityId ?? null, JSON.stringify(metadata));
const auth = (roles = []) => (req, res, next) => { try { const user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), jwtSecret); if (roles.length && !roles.includes(user.role)) return res.status(403).json({ error: 'Insufficient role' }); req.user = user; next(); } catch { res.status(401).json({ error: 'Authentication required' }); } };
const concepts = [
  ['capi', 'Computer-Assisted Personal Interviewing', 'Data Collection'], ['isolation forest', 'Isolation Forest-based anomaly detection', 'Data Informatics'], ['non-response', 'Bias caused when selected units do not respond', 'Survey Methodology'], ['gva', 'Gross Value Added before product taxes and subsidies', 'National Accounts'], ['gis', 'Spatially referenced data analysis', 'GIS & Spatial Analytics'], ['imputation', 'Estimating plausible missing values', 'Survey Methodology'], ['cloud', 'A managed data-processing and storage environment', 'Cloud Data Informatics']
];
const makeQuestions = (text) => {
  const found = concepts.filter(([term]) => text.toLowerCase().includes(term));
  return (found.length ? found : concepts.slice(0, 3)).slice(0, 4).map(([term, answer, domain], index) => ({ id: `q-${index + 1}`, questionText: `According to the submitted material, which option best describes ${term}?`, options: [answer, 'A paper-only manual process', 'Deleting records without review', 'An unrelated demographic indicator'], correctOptionIndex: 0, bloomsLevel: domain === 'Survey Methodology' ? 'Analyzing' : 'Understanding', domainCategory: domain, explanation: `The source material contains the concept “${term}”. Verify this draft item before publishing.` }));
};
const extract = async file => {
  if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) { const parser = new PDFParse({ data: file.buffer }); try { return (await parser.getText()).text; } finally { await parser.destroy(); } }
  if (file.mimetype.includes('wordprocessingml') || file.originalname.endsWith('.docx')) return (await mammoth.extractRawText({ buffer: file.buffer })).value;
  return file.buffer.toString('utf8');
};
app.get('/api/health', (_, res) => res.json({ status: 'ok', mode: 'local', liveIgotIntegration: false }));
app.post('/api/auth/login', (req, res) => { const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email); if (!user || !bcrypt.compareSync(req.body.password || '', user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' }); const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '8h' }); audit(user, 'login', 'user', user.id); res.json({ token, user: { id: user.id, email: user.email, role: user.role } }); });
app.post('/api/documents', auth(['admin', 'reviewer']), upload.single('file'), async (req, res, next) => { try { if (!req.file) return res.status(400).json({ error: 'A file is required' }); const text = (await extract(req.file)).trim(); if (text.length < 20) return res.status(400).json({ error: 'No usable text could be extracted' }); const result = db.prepare('INSERT INTO documents (filename, mime_type, extracted_text, uploaded_by) VALUES (?, ?, ?, ?)').run(req.file.originalname, req.file.mimetype, text, req.user.id); audit(req.user, 'upload_and_extract', 'document', result.lastInsertRowid, { filename: req.file.originalname }); res.status(201).json({ id: result.lastInsertRowid, filename: req.file.originalname, text, preview: text.slice(0, 500) }); } catch (error) { next(error); } });
app.post('/api/assessments', auth(['admin', 'reviewer']), (req, res) => { const text = String(req.body.text || '').trim(); if (text.length < 20) return res.status(400).json({ error: 'Learning material is too short' }); const questions = makeQuestions(text); const result = db.prepare('INSERT INTO assessments (document_id, questions_json) VALUES (?, ?)').run(req.body.documentId || null, JSON.stringify(questions)); audit(req.user, 'generate_draft_assessment', 'assessment', result.lastInsertRowid, { questionCount: questions.length }); res.status(201).json({ id: result.lastInsertRowid, questions, status: 'draft' }); });
app.get('/api/assessments', auth(), (req, res) => res.json(db.prepare('SELECT id, document_id, questions_json, status, created_at FROM assessments ORDER BY id DESC').all().map(a => ({ ...a, questions: JSON.parse(a.questions_json) }))));
app.patch('/api/assessments/:id/review', auth(['admin', 'reviewer']), (req, res) => { const status = req.body.status === 'approved' ? 'approved' : 'draft'; db.prepare('UPDATE assessments SET status = ?, reviewed_by = ? WHERE id = ?').run(status, req.user.id, req.params.id); audit(req.user, `${status}_assessment`, 'assessment', Number(req.params.id)); res.json({ id: Number(req.params.id), status }); });
app.get('/api/integration-readiness', auth(), (_, res) => res.json({ live: false, requiredBeforeActivation: ['MoSPI/iGOT sandbox and API specification', 'OAuth client credentials and redirect approval', 'data-sharing agreement and retention policy', 'penetration test and security review'], implementedLocally: ['JWT role controls', 'audit log', 'document extraction', 'reviewable assessment drafts'] }));
app.get('/api/audit-events', auth(['admin']), (_, res) => res.json(db.prepare('SELECT * FROM audit_events ORDER BY id DESC LIMIT 100').all()));
app.use((error, _, res, __) => { console.error(error); res.status(500).json({ error: 'Processing failed. The source file may be unsupported or malformed.' }); });
app.use(express.static('dist'));
app.get('/{*path}', (_, res) => res.sendFile('index.html', { root: 'dist' }));
app.listen(port, () => console.log(`MoSPI local API listening on http://localhost:${port}`));
