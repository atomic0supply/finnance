'use client';

interface Entry {
  income: number;
  expense: number;
}

interface Props {
  data: Record<string, Entry>;
  labels: string[];
  labelFormatter?: (label: string) => string;
}

export default function StatsChart({
  data,
  labels,
  labelFormatter = (l) => l,
}: Props) {
  return (
    <svg viewBox={`0 0 ${labels.length * 40} 200`} className="w-full">
      {labels.map((label, i) => {
        const income = data[label]?.income || 0;
        const expense = data[label]?.expense || 0;
        const max = Math.max(income, expense);
        const incomeHeight = (income / max) * 100 || 0;
        const expenseHeight = (expense / max) * 100 || 0;
        const x = i * 40;
        return (
          <g key={label} transform={`translate(${x},0)`}>
            <rect
              x={5}
              y={100 - incomeHeight}
              width={10}
              height={incomeHeight}
              fill="#4ade80"
            />
            <rect
              x={20}
              y={100 - expenseHeight}
              width={10}
              height={expenseHeight}
              fill="#f87171"
            />
            <text x={15} y={115} fontSize="10" textAnchor="middle">
              {labelFormatter(label)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
