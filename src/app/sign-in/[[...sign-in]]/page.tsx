'use client';

import { SignIn } from '@clerk/nextjs';
import { PublicHeader } from '@/components/PublicHeader';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
            <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
          </div>

          {/* Clerk SignIn Component */}
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-lg",
                }
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>

          {/* Security Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600">🔒</span>
              <h4 className="font-medium text-gray-900">Seguridad Garantizada</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Autenticación segura con Clerk</li>
              <li>• Múltiples métodos de autenticación</li>
              <li>• Datos protegidos por usuario</li>
              <li>• Gestión avanzada de sesiones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}