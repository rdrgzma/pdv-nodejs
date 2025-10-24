
import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Product, CartItem, Customer } from '../../types';
import { formatMoney } from '../../utils/helpers';
import { printReceipt } from '../../utils/print';

const PDV: React.FC = () => {
  const { products, customers, sales, addSale, storeInfo, categories } = useAppData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [amountPaid, setAmountPaid] = useState(0);

  const filteredProducts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearchTerm) {
      return products;
    }
    return products.filter(p =>
      p.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
      p.sku.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      incrementQuantity(product.id);
    } else {
      const category = categories.find(c => c.id === product.categoryId);
      if (category?.name === 'Peças' && product.estoque <= 0) {
        alert(`Produto ${product.nome} sem estoque.`);
        return;
      }
      const { estoque, estoqueMinimo, ...rest } = product;
      setCart([...cart, { ...rest, qtd: 1 }]);
    }
  };
  
  const incrementQuantity = (productId: number) => {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!cartItem || !product) return;

    const category = categories.find(c => c.id === product.categoryId);
    if (category?.name === 'Peças' && cartItem.qtd >= product.estoque) {
        alert(`Estoque máximo atingido para ${product.nome}.`);
        return;
    }

    setCart(cart.map(item => item.id === productId ? { ...item, qtd: item.qtd + 1 } : item));
  };

  const decrementQuantity = (productId: number) => {
      const newCart = cart.map(item => {
          if (item.id === productId) {
              return { ...item, qtd: item.qtd - 1 };
          }
          return item;
      }).filter(item => item.qtd > 0);
      setCart(newCart);
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.preco * item.qtd, 0), [cart]);
  const total = subtotal; // For simplicity, no discounts/additions for now
  const change = useMemo(() => (paymentMethod === 'Dinheiro' && amountPaid > total) ? amountPaid - total : 0, [paymentMethod, amountPaid, total]);

  const finishSale = () => {
    if (cart.length === 0) {
      alert("Carrinho está vazio.");
      return;
    }
    if (!storeInfo) {
      alert("Informações da loja não carregadas.");
      return;
    }

    const saleData = {
      numero: (sales.length + 1).toString().padStart(6, '0'),
      dataHora: new Date().toLocaleString('pt-BR'),
      itens: cart,
      subtotal,
      descontos: 0,
      acrescimos: 0,
      total,
      pagamento: paymentMethod,
      clienteId: selectedCustomer,
      recebido: amountPaid,
      troco: change
    };
    
    addSale(saleData);
    
    printReceipt(storeInfo, {
        ...saleData,
        cliente: customers.find(c => c.id === selectedCustomer)?.nome
    });

    // Reset state
    setCart([]);
    setSelectedCustomer(undefined);
    setPaymentMethod('Dinheiro');
    setAmountPaid(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Ponto de Venda</h2>
        <input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 h-[60vh] overflow-y-auto pr-2 items-start">
          {filteredProducts.map(p => {
            const category = categories.find(c => c.id === p.categoryId);
            const isPeca = category?.name === 'Peças';
            const isLowStock = isPeca && p.estoque > 0 && p.estoque <= p.estoqueMinimo;
            return (
              <button 
                key={p.id} 
                onClick={() => addToCart(p)} 
                className="relative border rounded-lg text-left dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow disabled:opacity-50 flex flex-col overflow-hidden"
                disabled={isPeca && p.estoque <= 0}>
                  
                <div className="relative">
                    <img src={p.imagem} alt={p.nome} className="w-full h-24 object-cover" />
                    {category && (
                        <span className={`absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            category.name === 'Peças' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                        {category.name}
                        </span>
                    )}
                    {isLowStock && (
                        <span className="absolute top-2 right-2 bg-yellow-500 text-white w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full" title={`Estoque baixo: ${p.estoque}!`}>
                            !
                        </span>
                    )}
                </div>
                
                <div className="p-2">
                  <h4 className="text-sm font-semibold leading-tight truncate" title={p.nome}>{p.nome}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.sku}</p>
                  <div className="mt-2 flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800 dark:text-gray-100">{formatMoney(p.preco)}</span>
                      <div className="text-xs">
                          {isPeca ? (
                              p.estoque > 0 ? (
                                  <span className="text-green-600 dark:text-green-400 font-medium">Em estoque ({p.estoque})</span>
                              ) : (
                                  <span className="text-red-500 dark:text-red-400 font-medium">Sem estoque</span>
                              )
                          ) : (
                              <span className="text-green-600 dark:text-green-400 font-medium">Disponível</span>
                          )}
                      </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Cart and Payment */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
        <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-gray-600">Carrinho</h3>
        <div className="flex-grow overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Carrinho vazio</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-3">
                <div className="flex-1">
                  <div className="font-semibold">{item.nome}</div>
                  <div className="text-sm text-gray-500">{formatMoney(item.preco)}</div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => decrementQuantity(item.id)} className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                    <span className="w-8 text-center">{item.qtd}</span>
                    <button onClick={() => incrementQuantity(item.id)} className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
                    <div className="w-24 text-right font-semibold">{formatMoney(item.preco * item.qtd)}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-4 dark:border-gray-600">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
          
          <select 
            className="w-full p-2 mb-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(Number(e.target.value) || undefined)}
          >
            <option value="">Cliente Balcão</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <select 
            className="w-full p-2 mb-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option>Dinheiro</option>
            <option>Cartão de Crédito</option>
            <option>Cartão de Débito</option>
            <option>Pix</option>
          </select>

          {paymentMethod === 'Dinheiro' && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input 
                type="number"
                placeholder="Valor Recebido"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={amountPaid || ''}
                onChange={e => setAmountPaid(Number(e.target.value))}
              />
              <div className="p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-right">
                Troco: {formatMoney(change)}
              </div>
            </div>
          )}

          <button onClick={finishSale} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 mt-2">
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDV;
