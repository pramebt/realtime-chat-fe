'use client';

import { MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">ChatApp</span>
          </div>
          <p className="text-xs text-gray-500">© 2025 ChatApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

