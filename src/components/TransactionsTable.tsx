'use client';
import { Transaction } from '@/data/transactions';

interface Props {
  transactions: Transaction[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TransactionsTable({
  transactions,
  page,
  pageSize,
  onPageChange,
}: Props) {
  const pageCount = Math.ceil(transactions.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const visible = transactions.slice(start, start + pageSize);

  return (
    <div>
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
        {visible.map((t) => (
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
      <div className="flex items-center justify-between mt-2 text-sm">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {pageCount}
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
