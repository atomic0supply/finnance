'use client';

import { SignUp } from '@clerk/nextjs';
import { PublicHeader } from '@/components/PublicHeader';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Únete a Finnance y gestiona tus finanzas</p>
          </div>

          {/* Clerk SignUp Component */}
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-lg",
                }
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>

          {/* Features Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">✨</span>
              <h4 className="font-medium text-gray-900">¿Por qué Finnance?</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gestión completa de transacciones</li>
              <li>• Control de propiedades y vehículos</li>
              <li>• Reportes detallados y análisis</li>
              <li>• Interfaz intuitiva y moderna</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}