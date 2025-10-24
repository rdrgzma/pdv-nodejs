import { Router } from 'express';
import { openDb } from '../database.js';

const router = Router();

// GET all customers
router.get('/', async (req, res, next) => {
  try {
    const db = await openDb();
    const results = await db.all('SELECT * FROM customers ORDER BY id');
    // Re-shape the flat data from DB into nested address object
    const customers = results.map(r => ({
      id: r.id, nome: r.nome, tipoDocumento: r.tipoDocumento, documento: r.documento, email: r.email, telefone: r.telefone, veiculo: r.veiculo,
      endereco: { logradouro: r.logradouro, bairro: r.bairro, cep: r.cep, cidade: r.cidade, uf: r.uf }
    }));
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// POST a new customer
router.post('/', async (req, res, next) => {
  try {
    const { nome, tipoDocumento, documento, email, telefone, veiculo, endereco } = req.body;
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO customers (nome, tipoDocumento, documento, email, telefone, veiculo, logradouro, bairro, cep, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      nome, tipoDocumento, documento, email, telefone, veiculo, endereco.logradouro, endereco.bairro, endereco.cep, endereco.cidade, endereco.uf
    );
    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    next(err);
  }
});

// PUT to update a customer
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, tipoDocumento, documento, email, telefone, veiculo, endereco } = req.body;
    const db = await openDb();
    await db.run(
      'UPDATE customers SET nome = ?, tipoDocumento = ?, documento = ?, email = ?, telefone = ?, veiculo = ?, logradouro = ?, bairro = ?, cep = ?, cidade = ?, uf = ? WHERE id = ?',
      nome, tipoDocumento, documento, email, telefone, veiculo, endereco.logradouro, endereco.bairro, endereco.cep, endereco.cidade, endereco.uf, id
    );
    res.json({ id: Number(id), ...req.body });
  } catch (err) {
    next(err);
  }
});

// DELETE a customer
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await openDb();
    await db.run('DELETE FROM customers WHERE id = ?', id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;