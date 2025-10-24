import { ReactNode } from "react";

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  nome: string;
  sku: string;
  categoryId: number;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  imagem: string;
}

export interface Address {
  logradouro: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
}

export interface Customer {
  id: number;
  nome: string;
  tipoDocumento: 'CPF' | 'CNPJ';
  documento: string;
  email: string;
  telefone: string;
  veiculo: string;
  endereco: Address;
}

export interface CartItem extends Omit<Product, 'estoque' | 'categoryId' | 'estoqueMinimo'> {
  qtd: number;
  categoryId: number;
}

export interface StoreInfo {
  nome: string;
  doc: string;
  endereco: string;
  contato: string;
}

export interface Sale {
  id: number;
  numero: string;
  dataHora: string;
  itens: CartItem[];
  subtotal: number;
  descontos: number;
  acrescimos: number;
  total: number;
  pagamento: string;
  clienteId?: number;
  recebido: number;
  troco: number;
}

export type UserRole = 'admin' | 'seller';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Should be hashed in a real app
  role: UserRole;
}


export type Section = 'pdv' | 'products' | 'customers' | 'reports' | 'financial' | 'settings' | 'users' | 'categories';