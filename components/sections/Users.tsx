
import React, { useState, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { User } from '../../types';
import Modal from '../Modal';

const Users: React.FC = () => {
    const { users, deleteUser } = useAppData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingUser(null);
        setModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (users.length <= 1) {
            alert("Não é possível excluir o único usuário do sistema.");
            return;
        }
        if (window.confirm("Deseja excluir este usuário?")) {
            deleteUser(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    onClick={() => openModal()}
                >
                    <span>+</span>
                    <span>Novo Usuário</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2">Nome</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Perfil</th>
                                <th className="p-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                            {user.role === 'admin' ? 'Admin' : 'Vendedor'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <UserModal isOpen={isModalOpen} onClose={closeModal} user={editingUser} />
        </div>
    );
};

const defaultUser: Omit<User, 'id'> = {
    name: '',
    email: '',
    role: 'seller',
    password: ''
};

const UserModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User | null }> = ({ isOpen, onClose, user }) => {
    const { users, addUser, updateUser } = useAppData();
    const [formData, setFormData] = useState<Partial<User>>(defaultUser);

    useEffect(() => {
        if (user) {
            setFormData({ ...user, password: '' }); // Don't show password
        } else {
            setFormData(defaultUser);
        }
    }, [user, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name?.trim() || !formData.email?.trim()) {
            alert("Nome e Email são obrigatórios.");
            return;
        }

        if(!user && !formData.password?.trim()) {
            alert("A senha é obrigatória para novos usuários.");
            return;
        }

        if (user) { // Editing
            const originalUser = users.find(u => u.id === user.id);
            if (!originalUser) return;
            
            const updatedUser: User = {
                ...originalUser,
                name: formData.name,
                email: formData.email,
                role: formData.role!,
            };
            if(formData.password){
                updatedUser.password = formData.password;
            } else {
                delete updatedUser.password; // Ensure password isn't updated if empty
            }
            updateUser(updatedUser);
        } else { // Creating
            addUser(formData as User);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={user ? 'Editar Usuário' : 'Novo Usuário'}>
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder={user ? 'Deixe em branco para não alterar' : ''} />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Perfil</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600">
                        <option value="admin">Admin</option>
                        <option value="seller">Vendedor</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

export default Users;