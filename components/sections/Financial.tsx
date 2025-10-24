import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import { formatMoney } from '../../utils/helpers';

const Financial: React.FC = () => {
    const { sales, customers } = useAppData();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Financeiro</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-4">Histórico de Transações</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-2">Nº Venda</th>
                                <th className="p-2">Data/Hora</th>
                                <th className="p-2">Cliente</th>
                                <th className="p-2">Pagamento</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2">{sale.numero}</td>
                                    <td className="p-2">{sale.dataHora}</td>
                                    <td className="p-2">{customers.find(c => c.id === sale.clienteId)?.nome || 'Balcão'}</td>
                                    <td className="p-2">{sale.pagamento}</td>
                                    <td className="p-2 text-right font-mono">{formatMoney(sale.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {sales.length === 0 && (
                    <p className="text-center py-8 text-gray-500">Nenhuma venda registrada.</p>
                )}
            </div>
        </div>
    );
};

export default Financial;
