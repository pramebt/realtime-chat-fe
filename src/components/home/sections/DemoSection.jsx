'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const DemoSection = () => {
  const benefits = [
    "Real-time messaging",
    "Typing indicators",
    "Multiple chat rooms",
    "Cross-device compatibility",
    "Secure authentication"
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Key Features
              </h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 mb-6">
                <MessageSquare className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Use
                </h4>
                <p className="text-gray-600 mb-6">
                  Sign up and start chatting instantly
                </p>
                <Link href="/register">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DemoSection;

