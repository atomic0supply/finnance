'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PublicHeader } from '@/components/PublicHeader';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper Clerk sign-up route
    router.replace('/sign-up');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirigiendo al registro...</p>
          </div>
        </div>
      </div>
    </div>
  );
}