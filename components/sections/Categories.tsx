
import React, { useState, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Category } from '../../types';
import Modal from '../Modal';

const Categories: React.FC = () => {
    const { categories, products, deleteCategory } = useAppData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const openModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingCategory(null);
        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        const isCategoryInUse = products.some(p => p.categoryId === id);
        if (isCategoryInUse) {
            alert("Não é possível excluir esta categoria, pois ela está sendo usada por um ou mais produtos.");
            return;
        }

        if (window.confirm("Deseja excluir esta categoria?")) {
            deleteCategory(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestão de Categorias</h2>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    onClick={() => openModal()}
                >
                    <span>+</span>
                    <span>Nova Categoria</span>
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2">ID</th>
                                <th className="p-2">Nome</th>
                                <th className="p-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2">{category.id}</td>
                                    <td className="p-2">{category.name}</td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => openModal(category)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {categories.length === 0 && (
                        <p className="text-center py-8 text-gray-500">Nenhuma categoria cadastrada.</p>
                    )}
                </div>
            </div>
            <CategoryModal isOpen={isModalOpen} onClose={closeModal} category={editingCategory} />
        </div>
    );
};

const defaultCategory: Omit<Category, 'id'> = {
    name: '',
};

const CategoryModal: React.FC<{ isOpen: boolean; onClose: () => void; category: Category | null }> = ({ isOpen, onClose, category }) => {
    const { addCategory, updateCategory } = useAppData();
    const [formData, setFormData] = useState<Omit<Category, 'id'>>(defaultCategory);

    useEffect(() => {
        if (category) {
            setFormData({ name: category.name });
        } else {
            setFormData(defaultCategory);
        }
    }, [category, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            alert("O nome da categoria é obrigatório.");
            return;
        }

        if (category) {
            updateCategory({ ...formData, id: category.id });
        } else {
            addCategory(formData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={category ? 'Editar Categoria' : 'Nova Categoria'}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="category-name" className="block text-sm font-medium mb-1">Nome da Categoria</label>
                    <input id="category-name" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
            </div>
        </Modal>
    );
};

export default Categories;