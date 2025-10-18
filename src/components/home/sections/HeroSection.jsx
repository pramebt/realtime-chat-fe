'use client';

import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 mb-8">
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="font-medium">Real-time messaging</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Connect instantly with anyone, anywhere
        </h1>

        {/* Description */}
        <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Simple, fast, and secure real-time chat application. Create rooms, invite friends, and start conversations instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 px-8 text-base font-medium shadow-sm transition-colors w-full sm:w-auto">
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl h-12 px-8 text-base font-medium transition-colors w-full sm:w-auto"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">1K+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5K+</div>
              <div className="text-sm text-gray-500">Messages Sent</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

