'use client';

interface Props {
  className?: string;
}

export default function Spinner({ className = '' }: Props) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}
