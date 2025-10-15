'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MessageSquare className="h-6 w-6 text-gray-800" />
          <span className="text-xl font-bold text-gray-900">ChatApp</span>
        </div>
        <p className="text-gray-600 mb-4">
          Real-time chat application that's fast and simple
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

