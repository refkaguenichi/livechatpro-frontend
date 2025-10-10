'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { useEffect } from 'react';

export default function MainLayout({ children }:{children:React.ReactNode}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Prevents rendering before redirect

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}