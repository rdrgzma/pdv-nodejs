
import React, { useState, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { StoreInfo } from '../../types';

const Settings: React.FC = () => {
    const { storeInfo, updateStoreInfo } = useAppData();
    const [formData, setFormData] = useState<StoreInfo | null>(storeInfo);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormData(storeInfo);
    }, [storeInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateStoreInfo(formData);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    if (!formData) {
        return <div>Carregando configurações...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Configurações da Loja</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome da Loja</label>
                        <input name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Documento (CNPJ)</label>
                        <input name="doc" value={formData.doc} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Endereço (para impressão)</label>
                        <input name="endereco" value={formData.endereco} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Contato (para impressão)</label>
                        <input name="contato" value={formData.contato} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                    </div>
                    <div className="flex justify-end items-center gap-4 pt-4 border-t dark:border-gray-700">
                         {isSaved && <span className="text-green-500">Salvo com sucesso!</span>}
                        <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;