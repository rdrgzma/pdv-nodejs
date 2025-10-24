import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import { formatMoney } from '../../utils/helpers';

const Reports: React.FC = () => {
  const { sales, products, customers } = useAppData();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;

  // By explicitly typing the accumulator `acc`, we ensure that `acc[item.id]` is treated as a number,
  // preventing a type error during the addition.
  const productSales = sales.flatMap(s => s.itens).reduce((acc: Record<number, number>, item) => {
    acc[item.id] = (acc[item.id] || 0) + item.qtd;
    return acc;
    // FIX: The initial value for reduce was `{}`, which has a weak type.
    // Casting it to the correct type ensures that `productSales` is properly typed,
    // which in turn fixes the type error in the `.sort()` method below.
  }, {} as Record<number, number>);

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, qty]) => ({
      product: products.find(p => p.id === Number(id)),
      quantity: qty
    }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Relatórios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-lg">Receita Total</h3>
          <p className="text-3xl font-bold">{formatMoney(totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-lg">Total de Vendas</h3>
          <p className="text-3xl font-bold">{totalSales}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-lg">Ticket Médio</h3>
          <p className="text-3xl font-bold">{formatMoney(totalSales > 0 ? totalRevenue / totalSales : 0)}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-lg">Clientes Cadastrados</h3>
          <p className="text-3xl font-bold">{customers.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-4">Produtos Mais Vendidos</h3>
          <ul>
            {topProducts.map(({ product, quantity }) => product && (
              <li key={product.id} className="flex justify-between py-2 border-b dark:border-gray-700">
                <span>{product.nome}</span>
                <span className="font-semibold">{quantity} un.</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-4">Últimas Vendas</h3>
           <ul>
            {sales.slice(-5).reverse().map(sale => (
              <li key={sale.id} className="flex justify-between py-2 border-b dark:border-gray-700">
                <div>
                  <span className="font-semibold">Venda #{sale.numero}</span>
                  <span className="text-sm text-gray-500 ml-2">{sale.dataHora}</span>
                </div>
                <span className="font-semibold">{formatMoney(sale.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Reports;
