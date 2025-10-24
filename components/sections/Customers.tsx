

import React, { useState, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Customer } from '../../types';
import { formatDocument } from '../../utils/helpers';
import Modal from '../Modal';

const Customers: React.FC = () => {
  const { customers, deleteCustomer } = useAppData();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const openModal = (customer: Customer | null = null) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setEditingCustomer(null);
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Deseja excluir este cliente?")) {
      deleteCustomer(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2" onClick={() => openModal()}>
          <span>+</span>
          <span>Novo Cliente</span>
        </button>
      </div>
      <div className="grid gap-4">
        {customers.map(c => (
          <div key={c.id} className="border rounded-lg p-4 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{c.nome}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {c.tipoDocumento}: {formatDocument(c.documento, c.tipoDocumento)}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 px-3 py-2 rounded-lg text-sm" onClick={() => openModal(c)}>✏️ Editar</button>
                <button className="text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 px-3 py-2 rounded-lg text-sm" onClick={() => handleDelete(c.id)}>🗑️</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-2"><span className="font-medium">📧 Email:</span> {c.email || 'Não informado'}</div>
                <div className="mb-2"><span className="font-medium">📱 Telefone:</span> {c.telefone || 'Não informado'}</div>
                <div><span className="font-medium">🚗 Veículo:</span> {c.veiculo || 'Não informado'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">📍 Endereço:</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {c.endereco?.logradouro || 'Não informado'}<br />
                  {c.endereco?.bairro && <>{c.endereco.bairro}<br /></>}
                  {c.endereco?.cidade || ''} - {c.endereco?.uf || ''}<br />
                  {c.endereco?.cep || ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CustomerModal isOpen={isModalOpen} onClose={closeModal} customer={editingCustomer} />
    </div>
  );
};

const defaultCustomer: Omit<Customer, 'id'> = {
    nome: '',
    tipoDocumento: 'CPF',
    documento: '',
    email: '',
    telefone: '',
    veiculo: '',
    endereco: {
        logradouro: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: ''
    }
};

const CustomerModal: React.FC<{ isOpen: boolean, onClose: () => void, customer: Customer | null }> = ({ isOpen, onClose, customer }) => {
    const { addCustomer, updateCustomer } = useAppData();
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>(defaultCustomer);

    useEffect(() => {
        if (customer) {
            setFormData(JSON.parse(JSON.stringify(customer)));
        } else {
            setFormData(JSON.parse(JSON.stringify(defaultCustomer)));
        }
    }, [customer, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name.startsWith('endereco.')) {
            const field = name.split('.')[1];
            // FIX: Removed `|| {}` which was causing a type mismatch. `prev.endereco` is guaranteed to exist by the `Customer` type.
            setFormData(prev => ({ ...prev, endereco: { ...prev.endereco, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSave = () => {
        if(!formData.nome?.trim()) {
            alert("Nome é obrigatório.");
            return;
        }

        if(customer) {
            updateCustomer({ ...formData, id: customer.id });
        } else {
            addCustomer(formData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={customer ? "Editar Cliente" : "Novo Cliente"}>
             <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nome / Razão Social</label>
                <input name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
                <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600">
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Documento</label>
                <input name="documento" value={formData.documento} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder={formData.tipoDocumento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input name="telefone" value={formData.telefone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder="(00) 00000-0000" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Veículo</label>
                <input name="veiculo" value={formData.veiculo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder="Ex: Honda Civic 2020" />
              </div>
            </div>
            
            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-medium mb-3">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Logradouro</label>
                  <input name="endereco.logradouro" value={formData.endereco?.logradouro} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder="Rua, Av, etc..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bairro</label>
                  <input name="endereco.bairro" value={formData.endereco?.bairro} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">CEP</label>
                  <input name="endereco.cep" value={formData.endereco?.cep} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" placeholder="00000-000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade</label>
                  <input name="endereco.cidade" value={formData.endereco?.cidade} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">UF</label>
                  <select name="endereco.uf" value={formData.endereco?.uf} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-600">
                    <option value="">Selecione...</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="PR">PR</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Modal>
    );
};

export default Customers;