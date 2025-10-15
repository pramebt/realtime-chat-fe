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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ถ้าไม่ได้ login ให้แสดง Landing Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // ถ้า login แล้วให้ redirect ไป chat (fallback)
  return null;
};

export default HomePage;
