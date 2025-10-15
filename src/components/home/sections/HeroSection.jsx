'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-700 border-gray-200">
          🚀 Now Available
        </Badge>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Real-time
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
            Chat
          </span>
          <br />
          Made Simple
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Send messages instantly with typing indicators, 
          create multiple chat rooms, and connect seamlessly across all devices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
            >
              Get Started Free!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
