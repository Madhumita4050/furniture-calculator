/**
 * server.js — Express app entry point
 *
 * DEV:        npm run dev (from root) — frontend runs on Vite :5173, backend on :3001
 * PRODUCTION: npm run build (from root) → npm start
 *             Express serves built React files + all API routes on a single port
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { adminAuth } = require('./middleware/auth');

const ordersRouter     = require('./routes/orders');
const priceConfigRouter = require('./routes/priceConfig');

const app  = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: isProd ? false : '*', // In production, same origin — no CORS needed
}));
app.use(express.json());

// ── API Routes (public) ─────────────────────────────────────────
app.use('/api/orders', ordersRouter);

// ── Serve generated PDFs ─────────────────────────────────────────
const fs = require('fs');
app.use('/generated-pdfs', express.static(path.join(__dirname, 'generated-pdfs')));
app.get('/api/orders/pdf/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'generated-pdfs', filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'PDF file not found' });
  }
});

// ── API Routes (admin — protected) ─────────────────────────────
app.use('/api/admin/price-config', adminAuth, priceConfigRouter);

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── Serve built React frontend (production only) ─────────────────
// After `npm run build`, Vite outputs to backend/public/
// Express serves those static files and falls back to index.html for SPA routing
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback — any non-API route returns index.html
// This makes /admin, /calculator etc. work on direct browser reload
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ── Start server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Furniture Calculator running on http://localhost:${PORT}`);
  if (isProd) {
    console.log(`   Frontend : http://localhost:${PORT}/`);
    console.log(`   Admin    : http://localhost:${PORT}/admin`);
  } else {
    console.log(`   API only (dev mode) — Frontend on http://localhost:5173`);
    console.log(`   Admin API: http://localhost:${PORT}/api/admin/price-config`);
  }
  console.log(`   Login    : ${process.env.ADMIN_USER || 'admin'} / ${process.env.ADMIN_PASS || 'admin@123'}\n`);
});
