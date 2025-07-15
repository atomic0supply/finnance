import test from 'node:test';
import assert from 'node:assert';
import transactions from '../src/data/transactions.js';
import { filterTransactions, aggregateByMonth, aggregateByYear } from '../src/services/transactionService.js';

// Sample filter for testing
const baseFilter = { query: '', from: '', to: '', type: 'all' };

test('filterTransactions filters by type', () => {
  const income = filterTransactions(transactions, { ...baseFilter, type: 'income' });
  assert.ok(income.every(t => t.type === 'income'));

  const expense = filterTransactions(transactions, { ...baseFilter, type: 'expense' });
  assert.ok(expense.every(t => t.type === 'expense'));
});

test('filterTransactions filters by query and dates', () => {
  const res = filterTransactions(transactions, { ...baseFilter, query: 'salary', from: '2024-07-01', to: '2024-07-31' });
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].description, 'Salary');
});

test('aggregateByMonth summarizes income and expenses per month', () => {
  const aggr = aggregateByMonth(transactions);
  assert.ok(aggr['2024-01']);
  assert.strictEqual(aggr['2024-01'].income, 5000);
  assert.strictEqual(aggr['2024-01'].expense, 180);
});

test('aggregateByYear summarizes income and expenses per year', () => {
  const aggr = aggregateByYear(transactions);
  assert.ok(aggr['2024']);
  assert.ok(aggr['2023']);
  assert.strictEqual(aggr['2023'].expense, 300);
  assert.strictEqual(aggr['2024'].income >= 5000, true);
});
