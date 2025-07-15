'use client';
import { Filter } from '@/services/transactionService';

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function FilterControls({ filter, onChange }: Props) {
  const handleChange = (field: keyof Filter, value: string) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <div className="grid sm:grid-cols-4 gap-4">
      <input
        className="border p-2"
        placeholder="Buscar..."
        value={filter.query}
        onChange={(e) => handleChange('query', e.target.value)}
      />
      <input
        className="border p-2"
        type="date"
        value={filter.from}
        onChange={(e) => handleChange('from', e.target.value)}
      />
      <input
        className="border p-2"
        type="date"
        value={filter.to}
        onChange={(e) => handleChange('to', e.target.value)}
      />
      <select
        className="border p-2"
        value={filter.type}
        onChange={(e) => handleChange('type', e.target.value)}
      >
        <option value="all">Todo</option>
        <option value="income">Ingresos</option>
        <option value="expense">Gastos</option>
      </select>
    </div>
  );
}
