import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes permisos para acceder a esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Usuario actual: <span className="font-medium">{user?.name}</span></p>
            <p>Rol: <span className="font-medium capitalize">{user?.role}</span></p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
            >
              Ir al Dashboard
            </Button>
            
            <Button 
              onClick={() => router.back()} 
              variant="outline"
              className="w-full"
            >
              Volver
            </Button>
            
            <Button 
              onClick={() => {
                logout();
                router.push('/login');
              }} 
              variant="destructive"
              className="w-full"
            >
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
