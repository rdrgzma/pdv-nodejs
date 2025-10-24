import { Router } from 'express';
import { openDb } from '../database.js';

const router = Router();

// GET all products
router.get('/', async (req, res) => {
  const db = await openDb();
  const products = await db.all('SELECT * FROM products ORDER BY id');
  res.json(products);
});

// POST a new product
router.post('/', async (req, res) => {
  const { nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem } = req.body;
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO products (nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)',
    nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem
  );
  res.status(201).json({ id: result.lastID, ...req.body });
});

// PUT to update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem } = req.body;
  const db = await openDb();
  await db.run(
    'UPDATE products SET nome = ?, sku = ?, categoryId = ?, preco = ?, estoque = ?, estoqueMinimo = ?, imagem = ? WHERE id = ?',
    nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem, id
  );
  res.json({ id: Number(id), ...req.body });
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await openDb();
  await db.run('DELETE FROM products WHERE id = ?', id);
  res.status(204).end();
});

export default router;
