
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Product, Customer, StoreInfo, Sale, User, Category } from '../types';
import * as db from '../utils/db';

interface AppDataContextType {
  // Data
  products: Product[];
  customers: Customer[];
  storeInfo: StoreInfo | null;
  sales: Sale[];
  users: User[];
  categories: Category[];
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  
  updateStoreInfo: (info: StoreInfo) => Promise<void>;
  
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  isLoading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize DB and load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initDB();
        setProducts(db.getProducts());
        setCustomers(db.getCustomers());
        setStoreInfo(db.getStoreInfo());
        setSales(db.getSales());
        setUsers(db.getUsers());
        setCategories(db.getCategories());
      } catch (error) {
        console.error("Failed to load data from DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  // --- Actions ---
  
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    db.addProduct(product);
    setProducts(db.getProducts());
  }, []);
  const updateProduct = useCallback(async (product: Product) => {
    db.updateProduct(product);
    setProducts(db.getProducts());
  }, []);
  const deleteProduct = useCallback(async (id: number) => {
    db.deleteProduct(id);
    setProducts(db.getProducts());
  }, []);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id'>) => {
    db.addCustomer(customer);
    setCustomers(db.getCustomers());
  }, []);
  const updateCustomer = useCallback(async (customer: Customer) => {
    db.updateCustomer(customer);
    setCustomers(db.getCustomers());
  }, []);
  const deleteCustomer = useCallback(async (id: number) => {
    db.deleteCustomer(id);
    setCustomers(db.getCustomers());
  }, []);
  
  const addSale = useCallback(async (sale: Omit<Sale, 'id'>) => {
    db.addSale(sale);
    setSales(db.getSales());
    setProducts(db.getProducts());
  }, []);

  const updateStoreInfo = useCallback(async (info: StoreInfo) => {
    const updatedInfo = db.updateStoreInfo(info);
    setStoreInfo(updatedInfo);
  }, []);
  
  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    db.addUser(user);
    setUsers(db.getUsers());
  }, []);
  const updateUser = useCallback(async (user: User) => {
    db.updateUser(user);
    setUsers(db.getUsers());
  }, []);
  const deleteUser = useCallback(async (id: number) => {
    db.deleteUser(id);
    setUsers(db.getUsers());
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    db.addCategory(category);
    setCategories(db.getCategories());
  }, []);
  const updateCategory = useCallback(async (category: Category) => {
    db.updateCategory(category);
    setCategories(db.getCategories());
  }, []);
  const deleteCategory = useCallback(async (id: number) => {
    db.deleteCategory(id);
    setCategories(db.getCategories());
  }, []);

  const value = useMemo(() => ({
    products, customers, storeInfo, sales, users, categories,
    addProduct, updateProduct, deleteProduct,
    addCustomer, updateCustomer, deleteCustomer,
    addSale,
    updateStoreInfo,
    addUser, updateUser, deleteUser,
    addCategory, updateCategory, deleteCategory,
    isLoading
  }), [
    products, customers, storeInfo, sales, users, categories,
    addProduct, updateProduct, deleteProduct,
    addCustomer, updateCustomer, deleteCustomer,
    addSale,
    updateStoreInfo,
    addUser, updateUser, deleteUser,
    addCategory, updateCategory, deleteCategory,
    isLoading
  ]);

  return React.createElement(AppDataContext.Provider, { value: value }, children);
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
