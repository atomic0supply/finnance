'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">Finnance</h1>
            <span className="ml-2 text-sm text-gray-500">v2.0</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
