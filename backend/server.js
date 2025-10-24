import express from 'express';
import cors from 'cors';
import { initDb } from './database.js';

// Importa as rotas da API
import productRoutes from './api/products.js';
import categoryRoutes from './api/categories.js';
import customerRoutes from './api/customers.js';
import userRoutes from './api/users.js';
import saleRoutes from './api/sales.js';
import settingsRoutes from './api/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Permite requisições do seu frontend
app.use(express.json()); // Permite que o servidor entenda JSON

// Inicializa o banco de dados
initDb();

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/settings', settingsRoutes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
