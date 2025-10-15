'use client';

import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-gray-800" />
          <span className="text-2xl font-bold text-gray-900">ChatApp</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

