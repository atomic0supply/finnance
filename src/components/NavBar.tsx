'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const linkClass = (path: string) =>
    `px-3 py-2 focus:outline-none focus-visible:ring rounded ${
      pathname === path ? 'underline font-semibold' : ''
    }`;

  return (
    <nav aria-label="Main navigation" className="bg-gray-800 text-white">
      <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4">
        <li>
          <Link href="/" className={linkClass('/')} aria-current={pathname === '/' ? 'page' : undefined}>
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className={linkClass('/dashboard')} aria-current={pathname === '/dashboard' ? 'page' : undefined}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/transactions" className={linkClass('/transactions')} aria-current={pathname === '/transactions' ? 'page' : undefined}>
            Transacciones
          </Link>
        </li>
        <li>
          <Link href="/reports" className={linkClass('/reports')} aria-current={pathname === '/reports' ? 'page' : undefined}>
            Reportes
          </Link>
        </li>
        <li>
          <Link href="/register" className={linkClass('/register')} aria-current={pathname === '/register' ? 'page' : undefined}>
            Crear Cuenta
          </Link>
        </li>
      </ul>
    </nav>
  );
}
