'use client';
import { Transaction } from '@/data/transactions';

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: Props) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Fecha</th>
          <th className="border p-2 text-left">Descripción</th>
          <th className="border p-2 text-left">Categoría</th>
          <th className="border p-2 text-right">Monto</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} className="odd:bg-gray-100">
            <td className="border p-2">{t.date}</td>
            <td className="border p-2">{t.description}</td>
            <td className="border p-2">{t.category}</td>
            <td className="border p-2 text-right">
              {t.type === 'expense' ? '-' : ''}${t.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
