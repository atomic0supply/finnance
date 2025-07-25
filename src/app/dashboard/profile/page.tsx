'use client';

import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="flex justify-center">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full max-w-4xl",
              card: "shadow-lg",
            }
          }}
        />
      </div>
    </div>
  );
}