'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { isAdmin } from '@/utils/adminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {
  //   // Skip check for login page
  //   if (pathname === '/admin/login') {
  //     return;
  //   }

  //   // Check if user is admin
  //   if (!isAdmin()) {
  //     router.push('/admin/login');
  //   }
  // }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
