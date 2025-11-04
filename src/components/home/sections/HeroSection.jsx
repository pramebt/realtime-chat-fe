'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Heading */}
        <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-gray-900 mb-6">
          Connect instantly with anyone
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          A clean, fast, and secure real-time chat app. Create rooms, invite friends, and start talking.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button className="bg-gray-900 hover:bg-black text-white rounded-full h-12 px-8 text-base font-medium shadow-none transition-colors w-full sm:w-auto">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900 hover:bg-black/5 rounded-full h-12 px-8 text-base font-medium transition-colors w-full sm:w-auto"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

