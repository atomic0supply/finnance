'use client';

import { useMemo, useState } from 'react';
import transactions from '@/data/transactions';
import {
  aggregateByMonth,
  aggregateByYear,
  filterTransactions,
  Filter,
} from '@/services/transactionService';
import FilterControls from '@/components/FilterControls';
import TransactionsTable from '@/components/TransactionsTable';
import StatsChart from '@/components/StatsChart';

export default function Dashboard() {
  const [filter, setFilter] = useState<Filter>({
    query: '',
    from: '',
    to: '',
    type: 'all',
  });

  const filtered = useMemo(
    () => filterTransactions(transactions, filter),
    [filter],
  );
  const monthly = useMemo(() => aggregateByMonth(filtered), [filtered]);
  const yearly = useMemo(() => aggregateByYear(filtered), [filtered]);

  const months = Object.keys(monthly).sort();
  const years = Object.keys(yearly).sort();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <FilterControls filter={filter} onChange={setFilter} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Transacciones</h2>
        <TransactionsTable transactions={filtered} />
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
    </div>
  );
}
