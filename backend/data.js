export const initialCategories = [
  { id: 1, name: 'Serviços' },
  { id: 2, name: 'Peças' },
];

export const initialProducts = [
  { id: 1, nome: "Troca de Óleo - Sintético", sku: "SERV-001", categoryId: 1, preco: 250.00, estoque: 999, estoqueMinimo: 0, imagem: "https://placehold.co/300x200/3B82F6/FFFFFF?text=Troca+de+Oleo" },
  { id: 2, nome: "Alinhamento e Balanceamento", sku: "SERV-002", categoryId: 1, preco: 120.00, estoque: 999, estoqueMinimo: 0, imagem: "https://placehold.co/300x200/3B82F6/FFFFFF?text=Alinhamento" },
  { id: 3, nome: "Pneu Aro 15", sku: "PEC-001", categoryId: 2, preco: 350.00, estoque: 20, estoqueMinimo: 10, imagem: "https://placehold.co/300x200/F97316/FFFFFF?text=Pneu+Aro+15" },
  { id: 4, nome: "Filtro de Ar", sku: "PEC-002", categoryId: 2, preco: 45.00, estoque: 50, estoqueMinimo: 15, imagem: "https://placehold.co/300x200/F97316/FFFFFF?text=Filtro+de+Ar" },
];

export const initialCustomers = [
  { 
    id: 1, 
    nome: "João da Silva", 
    tipoDocumento: "CPF", 
    documento: "12345678901", 
    email: "joao.silva@example.com", 
    telefone: "(11) 98765-4321", 
    veiculo: "Honda Civic 2020",
    endereco: {
        logradouro: 'Rua das Flores, 123',
        bairro: 'Centro',
        cep: '01001-000',
        cidade: 'São Paulo',
        uf: 'SP'
    }
  },
  { 
    id: 2, 
    nome: "Auto Peças Veloz Ltda", 
    tipoDocumento: "CNPJ", 
    documento: "12345678000199", 
    email: "compras@velocars.com", 
    telefone: "(21) 2345-6789", 
    veiculo: "Frota",
    endereco: {
        logradouro: 'Avenida Brasil, 1000',
        bairro: 'Bonsucesso',
        cep: '21040-360',
        cidade: 'Rio de Janeiro',
        uf: 'RJ'
    }
  },
];

export const initialStoreInfo = {
  nome: "Oficina Mecânica Rápida",
  doc: "CNPJ: 98.765.432/0001-10",
  endereco: "Rua Principal, 456 - Bairro Auto - Cidade, UF",
  contato: "Telefone: (55) 3333-4444 | Email: contato@oficinarapida.com"
};

export const initialUsers = [
    { id: 1, name: 'Admin', email: 'admin@demo.com', password: 'admin', role: 'admin' },
    { id: 2, name: 'Vendedor', email: 'seller@demo.com', password: 'seller', role: 'seller' },
];
