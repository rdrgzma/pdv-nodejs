import { Router } from 'express';
import { openDb } from '../database.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Login route
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const db = await openDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', email);

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
    } catch (err) {
        next(err);
    }
});


// GET all users (without passwords)
router.get('/', async (req, res, next) => {
  try {
    const db = await openDb();
    const users = await db.all('SELECT id, name, email, role FROM users ORDER BY id');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST a new user
router.post('/', async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Senha é obrigatória.' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      name, email, hashedPassword, role
    );
    res.status(201).json({ id: result.lastID, name, email, role });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }
    next(err);
  }
});

// PUT to update a user
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  
  try {
    const db = await openDb();
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        name, email, hashedPassword, role, id
      );
    } else {
      await db.run(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        name, email, role, id
      );
    }
    res.json({ id: Number(id), name, email, role });
  } catch(err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }
    next(err);
  }
});

// DELETE a user
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await openDb();
    await db.run('DELETE FROM users WHERE id = ?', id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;