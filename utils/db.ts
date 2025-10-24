
import { Product, Customer, StoreInfo, Sale, User, Category, CartItem } from '../types';
import { initialProducts, initialCustomers, initialStoreInfo, initialUsers, initialCategories } from '../data/initialData';

// This will be loaded from the script tag in index.html
declare const initSqlJs: any;

const DB_STORAGE_KEY = 'sqliteDb';

let db: any = null;

// Function to save the database to localStorage
const saveDatabase = () => {
    if (db) {
        const data = db.export();
        const blob = new Blob([data]);
        const reader = new FileReader();
        reader.onload = function(event) {
            if (event.target?.result) {
                 window.localStorage.setItem(DB_STORAGE_KEY, event.target.result as string);
            }
        };
        reader.readAsDataURL(blob);
    }
};

const createSchema = () => {
    db.run(`
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY,
            name TEXT
        );
        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            nome TEXT,
            sku TEXT,
            categoryId INTEGER,
            preco REAL,
            estoque INTEGER,
            estoqueMinimo INTEGER,
            imagem TEXT,
            FOREIGN KEY (categoryId) REFERENCES categories (id)
        );
        CREATE TABLE customers (
            id INTEGER PRIMARY KEY,
            nome TEXT,
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
            name TEXT,
            email TEXT,
            password TEXT,
            role TEXT
        );
        CREATE TABLE sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT,
            dataHora TEXT,
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
            saleId INTEGER,
            productId INTEGER,
            nome TEXT,
            preco REAL,
            qtd INTEGER,
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
};

const populateInitialData = () => {
    let stmt;
    // Categories
    stmt = db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)");
    initialCategories.forEach(c => stmt.run([c.id, c.name]));
    stmt.free();

    // Products
    stmt = db.prepare("INSERT INTO products (id, nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    initialProducts.forEach(p => stmt.run([p.id, p.nome, p.sku, p.categoryId, p.preco, p.estoque, p.estoqueMinimo, p.imagem]));
    stmt.free();

    // Customers
    stmt = db.prepare("INSERT INTO customers (id, nome, tipoDocumento, documento, email, telefone, veiculo, logradouro, bairro, cep, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    initialCustomers.forEach(c => stmt.run([c.id, c.nome, c.tipoDocumento, c.documento, c.email, c.telefone, c.veiculo, c.endereco.logradouro, c.endereco.bairro, c.endereco.cep, c.endereco.cidade, c.endereco.uf]));
    stmt.free();

    // Users
    stmt = db.prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)");
    initialUsers.forEach(u => stmt.run([u.id, u.name, u.email, u.password, u.role]));
    stmt.free();

    // Store Info
    stmt = db.prepare("INSERT INTO store_info (id, nome, doc, endereco, contato) VALUES (?, ?, ?, ?, ?)");
    stmt.run([1, initialStoreInfo.nome, initialStoreInfo.doc, initialStoreInfo.endereco, initialStoreInfo.contato]);
    stmt.free();

    saveDatabase();
};


export const initDB = async () => {
    if (db) return db;
    try {
        const SQL = await initSqlJs({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });
        const savedDbString = window.localStorage.getItem(DB_STORAGE_KEY);
        if (savedDbString) {
            const response = await fetch(savedDbString);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            db = new SQL.Database(uint8Array);
        } else {
            db = new SQL.Database();
            createSchema();
            populateInitialData();
        }
        return db;
    } catch (err) {
        console.error("Database initialization failed:", err);
    }
};

const resultsToObjects = (stmt: any): any[] => {
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
};

// --- Data Access Functions ---

export const getCategories = (): Category[] => resultsToObjects(db.prepare("SELECT * FROM categories ORDER BY id"));
export const addCategory = (category: Omit<Category, 'id'>) => {
    db.run("INSERT INTO categories (name) VALUES (?)", [category.name]);
    saveDatabase();
};
export const updateCategory = (category: Category) => {
    db.run("UPDATE categories SET name = ? WHERE id = ?", [category.name, category.id]);
    saveDatabase();
};
export const deleteCategory = (id: number) => {
    db.run("DELETE FROM categories WHERE id = ?", [id]);
    saveDatabase();
};

export const getProducts = (): Product[] => resultsToObjects(db.prepare("SELECT * FROM products ORDER BY id"));
export const addProduct = (product: Omit<Product, 'id'>) => {
    db.run("INSERT INTO products (nome, sku, categoryId, preco, estoque, estoqueMinimo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)", [product.nome, product.sku, product.categoryId, product.preco, product.estoque, product.estoqueMinimo, product.imagem]);
    saveDatabase();
};
export const updateProduct = (product: Product) => {
    db.run("UPDATE products SET nome = ?, sku = ?, categoryId = ?, preco = ?, estoque = ?, estoqueMinimo = ?, imagem = ? WHERE id = ?", [product.nome, product.sku, product.categoryId, product.preco, product.estoque, product.estoqueMinimo, product.imagem, product.id]);
    saveDatabase();
};
export const deleteProduct = (id: number) => {
    db.run("DELETE FROM products WHERE id = ?", [id]);
    saveDatabase();
};

export const getCustomers = (): Customer[] => {
    return resultsToObjects(db.prepare("SELECT * FROM customers ORDER BY id")).map((r: any) => ({
        id: r.id, nome: r.nome, tipoDocumento: r.tipoDocumento, documento: r.documento, email: r.email, telefone: r.telefone, veiculo: r.veiculo,
        endereco: { logradouro: r.logradouro, bairro: r.bairro, cep: r.cep, cidade: r.cidade, uf: r.uf }
    }));
};
export const addCustomer = (customer: Omit<Customer, 'id'>) => {
    db.run("INSERT INTO customers (nome, tipoDocumento, documento, email, telefone, veiculo, logradouro, bairro, cep, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
        customer.nome, customer.tipoDocumento, customer.documento, customer.email, customer.telefone, customer.veiculo,
        customer.endereco.logradouro, customer.endereco.bairro, customer.endereco.cep, customer.endereco.cidade, customer.endereco.uf
    ]);
    saveDatabase();
};
export const updateCustomer = (customer: Customer) => {
    db.run("UPDATE customers SET nome = ?, tipoDocumento = ?, documento = ?, email = ?, telefone = ?, veiculo = ?, logradouro = ?, bairro = ?, cep = ?, cidade = ?, uf = ? WHERE id = ?", [
        customer.nome, customer.tipoDocumento, customer.documento, customer.email, customer.telefone, customer.veiculo,
        customer.endereco.logradouro, customer.endereco.bairro, customer.endereco.cep, customer.endereco.cidade, customer.endereco.uf, customer.id
    ]);
    saveDatabase();
};
export const deleteCustomer = (id: number) => {
    db.run("DELETE FROM customers WHERE id = ?", [id]);
    saveDatabase();
};

export const getUsers = (): User[] => resultsToObjects(db.prepare("SELECT * FROM users ORDER BY id"));
export const addUser = (user: Omit<User, 'id'>) => {
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [user.name, user.email, user.password, user.role]);
    saveDatabase();
};
export const updateUser = (user: User) => {
    if (user.password) {
        db.run("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?", [user.name, user.email, user.password, user.role, user.id]);
    } else {
        db.run("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [user.name, user.email, user.role, user.id]);
    }
    saveDatabase();
};
export const deleteUser = (id: number) => {
    db.run("DELETE FROM users WHERE id = ?", [id]);
    saveDatabase();
};

export const getStoreInfo = (): StoreInfo => {
    return db.prepare("SELECT * FROM store_info WHERE id = 1").getAsObject() as StoreInfo;
};
export const updateStoreInfo = (info: StoreInfo): StoreInfo => {
    db.run("UPDATE store_info SET nome = ?, doc = ?, endereco = ?, contato = ? WHERE id = 1", [info.nome, info.doc, info.endereco, info.contato]);
    saveDatabase();
    return getStoreInfo();
};

export const getSales = (): Sale[] => {
    const salesResults = resultsToObjects(db.prepare("SELECT * FROM sales ORDER BY id ASC"));
    const itemsStmt = db.prepare("SELECT * FROM sale_items WHERE saleId = ?");

    const salesWithItems = salesResults.map((sale: any) => {
        itemsStmt.bind([sale.id]);
        
        const itemsResult: any[] = [];
        while (itemsStmt.step()) {
            itemsResult.push(itemsStmt.getAsObject());
        }

        const items: CartItem[] = itemsResult.map((item: any) => ({
            id: item.productId,
            nome: item.nome,
            preco: item.preco,
            qtd: item.qtd,
            sku: '',
            imagem: '',
            categoryId: 0 // This info isn't stored per-item in sale_items, default or join if needed
        }));
        
        itemsStmt.reset();
        
        return { ...sale, itens: items };
    });
    
    itemsStmt.free();
    
    return salesWithItems;
};

export const addSale = (sale: Omit<Sale, 'id'>) => {
    db.exec("BEGIN TRANSACTION;");
    try {
        const saleStmt = db.prepare("INSERT INTO sales (numero, dataHora, subtotal, descontos, acrescimos, total, pagamento, clienteId, recebido, troco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id");
        const saleResult = saleStmt.getAsObject([sale.numero, sale.dataHora, sale.subtotal, sale.descontos, sale.acrescimos, sale.total, sale.pagamento, sale.clienteId ?? null, sale.recebido, sale.troco]);
        saleStmt.free();
        const saleId = saleResult.id;

        const itemStmt = db.prepare("INSERT INTO sale_items (saleId, productId, nome, preco, qtd) VALUES (?, ?, ?, ?, ?)");
        const stockStmt = db.prepare("UPDATE products SET estoque = estoque - ? WHERE id = ?");
        const categoryStmt = db.prepare("SELECT c.name FROM categories c JOIN products p ON p.categoryId = c.id WHERE p.id = ?");

        sale.itens.forEach((item: CartItem) => {
            itemStmt.run([saleId, item.id, item.nome, item.preco, item.qtd]);
            const catResult = categoryStmt.getAsObject([item.id]);
            if (catResult && catResult.name === 'Peças') {
                stockStmt.run([item.qtd, item.id]);
            }
        });
        
        categoryStmt.free();
        itemStmt.free();
        stockStmt.free();
        db.exec("COMMIT;");
        saveDatabase();
    } catch (e) {
        db.exec("ROLLBACK;");
        console.error("Failed to add sale:", e);
        throw e;
    }
};
