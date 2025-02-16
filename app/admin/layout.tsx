'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAdmin } from '@/utils/adminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    
    if (!isAdmin()) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="shadow-md bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center ">
            <div className="flex-shrink-0 w-full">
              <h1 className="text-2xl font-bold text-center text-white">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
