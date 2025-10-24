import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { initialProducts, initialCustomers, initialStoreInfo, initialUsers, initialCategories } from './data.js';
import bcrypt from 'bcryptjs';

let db;

export async function openDb() {
  if (db) return db;
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  return db;
}

async function createSchema(db) {
  await db.exec(`
    CREATE TABLE categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
    CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        categoryId INTEGER,
        preco REAL,
        estoque INTEGER,
        estoqueMinimo INTEGER,
        imagem TEXT,
        FOREIGN KEY (categoryId) REFERENCES categories (id)
    );
    CREATE TABLE customers (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        tipoDocumento TEXT,
        documento TEXT,
        email TEXT,
        telefone TEXT,
        veiculo TEXT,
        logradouro TEXT,
        bairro TEXT,
        cep TEXT,
        cidade TEXT,
        uf TEXT
    );
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    );
    CREATE TABLE sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL,
        dataHora TEXT NOT NULL,
        subtotal REAL,
        descontos REAL,
        acrescimos REAL,
        total REAL,
        pagamento TEXT,
        clienteId INTEGER,
        recebido REAL,
        troco REAL
    );
    CREATE TABLE sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saleId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        qtd INTEGER NOT NULL,
        FOREIGN KEY (saleId) REFERENCES sales (id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products (id)
    );
    CREATE TABLE store_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        nome TEXT,
        doc TEXT,
        endereco TEXT,
        contato TEXT
    );
  `);
}

async function populateData(db) {
    for (const c of initialCategories) {
      await db.run("INSERT INTO categories (id, name) VALUES (?, ?)", c.id, c.name);
    }
    for (const p of initialProducts) {
      await db.run("INSERT INTO products (id, nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", p.id, p.nome, p.sku, p.categoryId, p.preco, p.estoque, p.estoqueMinimo, p.imagem);
    }
    for (const c of initialCustomers) {
      await db.run("INSERT INTO customers (id, nome, tipoDocumento, documento, email, telefone, veiculo, logradouro, bairro, cep, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", c.id, c.nome, c.tipoDocumento, c.documento, c.email, c.telefone, c.veiculo, c.endereco.logradouro, c.endereco.bairro, c.endereco.cep, c.endereco.cidade, c.endereco.uf);
    }
    for (const u of initialUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await db.run("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)", u.id, u.name, u.email, hashedPassword, u.role);
    }
    await db.run("INSERT INTO store_info (id, nome, doc, endereco, contato) VALUES (?, ?, ?, ?, ?)", 1, initialStoreInfo.nome, initialStoreInfo.doc, initialStoreInfo.endereco, initialStoreInfo.contato);
}


export async function initDb() {
  const db = await openDb();
  const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'");
  if (!tableExists) {
    console.log("Banco de dados não encontrado, criando e populando...");
    await createSchema(db);
    await populateData(db);
    console.log("Banco de dados criado com sucesso.");
  } else {
    console.log("Banco de dados já existe.");
  }
}
