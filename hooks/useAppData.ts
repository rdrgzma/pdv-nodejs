import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Product, Customer, StoreInfo, Sale, User, Category } from '../types';

// The new backend API base URL
const API_BASE_URL = 'http://localhost:3001/api';

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

  // Initialize by loading all data from the API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, customersRes, storeInfoRes, salesRes, usersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/customers`),
          fetch(`${API_BASE_URL}/settings/store-info`),
          fetch(`${API_BASE_URL}/sales`),
          fetch(`${API_BASE_URL}/users`),
          fetch(`${API_BASE_URL}/categories`),
        ]);

        if (!productsRes.ok || !customersRes.ok || !storeInfoRes.ok || !salesRes.ok || !usersRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch initial data from API');
        }

        const productsData = await productsRes.json();
        const customersData = await customersRes.json();
        const storeInfoData = await storeInfoRes.json();
        const salesData = await salesRes.json();
        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCustomers(customersData);
        setStoreInfo(storeInfoData);
        setSales(salesData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data from API", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  // --- Actions ---
  
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const newProduct = await response.json();
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const updatedProduct = await response.json();
    setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const newCustomer = await response.json();
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const updateCustomer = useCallback(async (customer: Customer) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const updatedCustomer = await response.json();
    setCustomers(prev => prev.map(c => c.id === customer.id ? updatedCustomer : c));
  }, []);

  const deleteCustomer = useCallback(async (id: number) => {
    await fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE' });
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);
  
  const addSale = useCallback(async (sale: Omit<Sale, 'id'>) => {
    await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    // After a sale, product stock and sales list are updated, so we re-fetch both for consistency
    const [salesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/sales`),
      fetch(`${API_BASE_URL}/products`),
    ]);
    setSales(await salesRes.json());
    setProducts(await productsRes.json());
  }, []);

  const updateStoreInfo = useCallback(async (info: StoreInfo) => {
    const response = await fetch(`${API_BASE_URL}/settings/store-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    });
    const updatedInfo = await response.json();
    setStoreInfo(updatedInfo);
  }, []);
  
  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const newUser = await response.json();
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback(async (user: User) => {
    const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const updatedUser = await response.json();
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updatedUser } : u));
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    const newCategory = await response.json();
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    const updatedCategory = await response.json();
    setCategories(prev => prev.map(c => c.id === category.id ? updatedCategory : c));
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== id));
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
