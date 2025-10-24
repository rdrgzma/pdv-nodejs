import { Router } from 'express';
import { openDb } from '../database.js';

const router = Router();

// GET all sales with items
router.get('/', async (req, res) => {
  const db = await openDb();
  const sales = await db.all('SELECT * FROM sales ORDER BY id ASC');
  const items = await db.all('SELECT * FROM sale_items');
  
  const salesWithItems = sales.map(sale => ({
    ...sale,
    itens: items.filter(item => item.saleId === sale.id).map(item => ({
        id: item.productId,
        nome: item.nome,
        preco: item.preco,
        qtd: item.qtd,
    }))
  }));
  
  res.json(salesWithItems);
});

// POST a new sale (transaction)
router.post('/', async (req, res, next) => {
  const { numero, dataHora, subtotal, descontos, acrescimos, total, pagamento, clienteId, recebido, troco, itens } = req.body;
  const db = await openDb();
  
  try {
    await db.exec('BEGIN TRANSACTION');

    const result = await db.run(
      'INSERT INTO sales (numero, dataHora, subtotal, descontos, acrescimos, total, pagamento, clienteId, recebido, troco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      numero, dataHora, subtotal, descontos, acrescimos, total, pagamento, clienteId ?? null, recebido, troco
    );
    const saleId = result.lastID;

    for (const item of itens) {
      await db.run(
        'INSERT INTO sale_items (saleId, productId, nome, preco, qtd) VALUES (?, ?, ?, ?, ?)',
        saleId, item.id, item.nome, item.preco, item.qtd
      );
      
      const category = await db.get('SELECT c.name FROM categories c JOIN products p ON p.categoryId = c.id WHERE p.id = ?', item.id);
      if (category && category.name === 'Peças') {
        await db.run('UPDATE products SET estoque = estoque - ? WHERE id = ?', item.qtd, item.id);
      }
    }

    await db.exec('COMMIT');
    res.status(201).json({ message: "Venda registrada com sucesso!", saleId });
  } catch (error) {
    await db.exec('ROLLBACK');
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

export default router;
