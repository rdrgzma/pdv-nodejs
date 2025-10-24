import { Router } from 'express';
import { openDb } from '../database.js';

const router = Router();

// GET store info
router.get('/store-info', async (req, res) => {
  const db = await openDb();
  const storeInfo = await db.get('SELECT * FROM store_info WHERE id = 1');
  res.json(storeInfo);
});

// PUT to update store info
router.put('/store-info', async (req, res) => {
  const { nome, doc, endereco, contato } = req.body;
  const db = await openDb();
  await db.run(
    'UPDATE store_info SET nome = ?, doc = ?, endereco = ?, contato = ? WHERE id = 1',
    nome, doc, endereco, contato
  );
  res.json(req.body);
});

export default router;
