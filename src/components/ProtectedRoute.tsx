import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import Spinner from '@/components/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'viewer';
  requiredPermission?: {
    resource: string;
    action: string;
  };
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasPermission } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (user && requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }

    if (user && requiredPermission) {
      const { resource, action } = requiredPermission;
      if (!hasPermission(resource, action)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, requiredPermission, router, hasPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return null;
  }

  if (requiredPermission && user) {
    const { resource, action } = requiredPermission;
    if (!hasPermission(resource, action)) {
      return null;
    }
  }

  return <>{children}</>;
}
