import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useFinanceStore } from '@/stores/useFinanceStore';

/**
 * Hook para cargar automáticamente los datos del usuario cuando se autentica
 */
export const useDataLoader = () => {
  const { user, isLoaded } = useUser();
  const { fetchAllData, isLoading, error } = useFinanceStore();

  useEffect(() => {
    // Solo cargar datos si el usuario está autenticado y Clerk ha terminado de cargar
    if (isLoaded && user) {
      fetchAllData();
    }
  }, [isLoaded, user, fetchAllData]);

  return {
    isLoading,
    error,
    isUserLoaded: isLoaded,
    user,
  };
};