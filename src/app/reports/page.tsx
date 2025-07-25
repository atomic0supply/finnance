'use client';
import { useState } from 'react';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ToastProvider';
import type { Transaction } from '@/stores/useFinanceStore';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      const header = 'date,description,amount\n';
      const rows = data
        .map((t: Transaction) => `${t.date},${t.description.replace(/,/g, ';')},${t.amount}`)
        .join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.csv';
      link.click();
      URL.revokeObjectURL(url);
      addToast('Reporte generado');
    } catch {
      addToast('Error al generar reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Reportes</h1>
      <button
        onClick={generate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? <Spinner className="h-4 w-4" /> : 'Generar CSV'}
      </button>
    </div>
  );
}
