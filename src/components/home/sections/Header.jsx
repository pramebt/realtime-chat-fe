'use client';

import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm border-b border-black/5">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-gray-900" />
            <span className="text-base font-medium tracking-tight text-gray-900">ChatApp</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-gray-900 hover:bg-black/5 rounded-full h-9 px-5 font-medium transition-colors"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full h-9 px-5 font-medium shadow-none transition-colors">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

