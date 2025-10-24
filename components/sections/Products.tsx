

import React, { useState, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Product, Category } from '../../types';
import { formatMoney } from '../../utils/helpers';
import Modal from '../Modal';

const Products: React.FC = () => {
    const { products, categories, deleteProduct } = useAppData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const openModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingProduct(null);
        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Deseja excluir este produto?")) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    onClick={() => openModal()}
                >
                    <span>+</span>
                    <span>Novo Produto</span>
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2">Produto</th>
                                <th className="p-2">Categoria</th>
                                <th className="p-2">SKU</th>
                                <th className="p-2 text-right">Preço</th>
                                <th className="p-2 text-right">Estoque</th>
                                <th className="p-2 text-right">Est. Mínimo</th>
                                <th className="p-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const isLowStock = product.estoque > 0 && product.estoque <= product.estoqueMinimo;
                                const isOutOfStock = product.estoque === 0;

                                return (
                                <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2 flex items-center gap-3">
                                        <img src={product.imagem} alt={product.nome} className="w-10 h-10 rounded object-cover" />
                                        <span>{product.nome}</span>
                                    </td>
                                    <td className="p-2">{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</td>
                                    <td className="p-2">{product.sku}</td>
                                    <td className="p-2 text-right">{formatMoney(product.preco)}</td>
                                    <td className={`p-2 text-right ${isLowStock ? 'text-yellow-500 font-bold' : ''} ${isOutOfStock ? 'text-red-500' : ''}`}>
                                        {isLowStock && <span title="Estoque baixo!">⚠️ </span>}
                                        {product.estoque}
                                    </td>
                                    <td className="p-2 text-right">{product.estoqueMinimo}</td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
            <ProductModal isOpen={isModalOpen} onClose={closeModal} product={editingProduct} />
        </div>
    );
};

const defaultProduct: Omit<Product, 'id'> = {
    nome: '',
    sku: '',
    categoryId: 1,
    preco: 0,
    estoque: 0,
    estoqueMinimo: 0,
    imagem: 'https://placehold.co/300x200/cccccc/ffffff?text=Imagem'
};

const ProductModal: React.FC<{ isOpen: boolean; onClose: () => void; product: Product | null }> = ({ isOpen, onClose, product }) => {
    const { categories, addProduct, updateProduct } = useAppData();
    const [formData, setFormData] = useState<Omit<Product, 'id'>>(defaultProduct);

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData(defaultProduct);
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64String = loadEvent.target?.result as string;
                if (base64String) {
                    setFormData(prev => ({ ...prev, imagem: base64String }));
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSave = () => {
        if (!formData.nome.trim() || !formData.sku.trim()) {
            alert("Nome e SKU são obrigatórios.");
            return;
        }

        if (product) {
            updateProduct({ ...formData, id: product.id });
        } else {
            addProduct(formData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={product ? 'Editar Produto' : 'Novo Produto'}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                    <input name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">SKU</label>
                        <input name="sku" value={formData.sku} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Categoria</label>
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600">
                            {categories.map((c: Category) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                        <input name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estoque</label>
                        <input name="estoque" type="number" value={formData.estoque} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estoque Mínimo</label>
                        <input name="estoqueMinimo" type="number" value={formData.estoqueMinimo ?? 0} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Imagem do Produto</label>
                    <div className="mt-1 flex items-center gap-4">
                        <img 
                            src={formData.imagem} 
                            alt="Pré-visualização" 
                            className="w-20 h-20 rounded object-cover bg-gray-200 dark:bg-gray-700" 
                        />
                        <div className="flex-grow">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageChange}
                                id="image-upload"
                                className="hidden"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Trocar Imagem
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Products;