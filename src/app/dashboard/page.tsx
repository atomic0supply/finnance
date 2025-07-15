'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ToastProvider';
import type { Transaction } from '@/data/transactions';
import {
  aggregateByMonth,
  aggregateByYear,
  filterTransactions,
  Filter,
} from '@/services/transactionService';
import FilterControls from '@/components/FilterControls';
const TransactionsTable = dynamic(() => import('@/components/TransactionsTable'));
const StatsChart = dynamic(() => import('@/components/StatsChart'));

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();
  const [filter, setFilter] = useState<Filter>({
    query: '',
    from: '',
    to: '',
    type: 'all',
  });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const start = performance.now();
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        console.log('API response time', performance.now() - start, 'ms');
        setTransactions(data);
      })
      .catch(() => {
        addToast('Error al cargar transacciones', 'error');
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const filtered = useMemo(
    () => filterTransactions(transactions, filter),
    [transactions, filter],
  );
  const monthly = useMemo(() => aggregateByMonth(filtered), [filtered]);
  const yearly = useMemo(() => aggregateByYear(filtered), [filtered]);

  const months = Object.keys(monthly).sort();
  const years = Object.keys(yearly).sort();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <FilterControls filter={filter} onChange={setFilter} />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Transacciones</h2>
            <TransactionsTable
              transactions={filtered}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Estadísticas Mensuales</h2>
            <StatsChart
              data={monthly}
              labels={months}
              labelFormatter={(l) => l.slice(5)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Estadísticas Anuales</h2>
            <StatsChart data={yearly} labels={years} />
          </section>
        </>
      )}
    </div>
  );
}
