'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { useAuthStore } from '@/stores/useAuthStore';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  // Páginas que no deben mostrar el sidebar
  const publicPages = ['/', '/login', '/register', '/unauthorized'];
  const isPublicPage = publicPages.includes(pathname);
  
  // Si es una página pública O el usuario no está autenticado, mostrar sin sidebar
  if (isPublicPage || !user) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // Si es una página privada Y el usuario está autenticado, mostrar con sidebar
  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
