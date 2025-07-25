'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { AppSidebar } from './AppSidebar';
import { useDataLoader } from '@/hooks/useDataLoader';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  
  // Cargar datos automáticamente cuando el usuario se autentica
  const { isLoading: isDataLoading, error: dataError } = useDataLoader();
  
  // Páginas que no deben mostrar el sidebar
  const publicPages = ['/', '/login', '/register', '/unauthorized', '/sign-in', '/sign-up'];
  const isPublicPage = publicPages.includes(pathname) || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Si es una página pública O el usuario no está autenticado, mostrar sin sidebar
  if (isPublicPage || !isSignedIn) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Mostrar error de datos si existe
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600">{dataError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  // Si es una página privada Y el usuario está autenticado, mostrar con sidebar
  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Mostrar indicador de carga si los datos se están cargando */}
        {isDataLoading && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Cargando datos...
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
