'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LandingPage from '../components/home/LandingPage';

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, loading, router]);

  // แสดง loading ขณะตรวจสอบ authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  // ถ้ายังไม่ login ให้แสดง Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return null;
}

export default HomePage;
