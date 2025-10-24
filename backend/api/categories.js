import { Router } from 'express';
import { openDb } from '../database.js';

const router = Router();

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const db = await openDb();
    const categories = await db.all('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST a new category
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    const db = await openDb();
    const result = await db.run('INSERT INTO categories (name) VALUES (?)', name);
    res.status(201).json({ id: result.lastID, name });
  } catch (err) {
    next(err);
  }
});

// PUT to update a category
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const db = await openDb();
    await db.run('UPDATE categories SET name = ? WHERE id = ?', name, id);
    res.json({ id: Number(id), name });
  } catch (err) {
    next(err);
  }
});

// DELETE a category
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await openDb();
    await db.run('DELETE FROM categories WHERE id = ?', id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;