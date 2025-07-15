import { Transaction } from '@/data/transactions';

export interface Filter {
  query: string;
  from: string;
  to: string;
  type: 'all' | 'income' | 'expense';
}

export function filterTransactions(data: Transaction[], filter: Filter) {
  return data.filter((t) => {
    const matchQuery = t.description
      .toLowerCase()
      .includes(filter.query.toLowerCase());
    const matchType = filter.type === 'all' || t.type === filter.type;
    const afterFrom = !filter.from || new Date(t.date) >= new Date(filter.from);
    const beforeTo = !filter.to || new Date(t.date) <= new Date(filter.to);
    return matchQuery && matchType && afterFrom && beforeTo;
  });
}

export function aggregateByMonth(data: Transaction[]) {
  const map: Record<string, { income: number; expense: number }> = {};
  data.forEach((t) => {
    const key = new Date(t.date).toISOString().slice(0, 7);
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    map[key][t.type] += t.amount;
  });
  return map;
}

export function aggregateByYear(data: Transaction[]) {
  const map: Record<string, { income: number; expense: number }> = {};
  data.forEach((t) => {
    const key = new Date(t.date).getFullYear().toString();
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    map[key][t.type] += t.amount;
  });
  return map;
}
