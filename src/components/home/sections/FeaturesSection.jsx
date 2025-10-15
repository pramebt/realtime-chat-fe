'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Zap, Shield, Smartphone, Globe, Key } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-gray-600" />,
      title: "Real-time Chat",
      description: "Send messages instantly with typing indicators"
    },
    {
      icon: <Users className="h-6 w-6 text-gray-600" />,
      title: "Multiple Rooms",
      description: "Create and manage multiple chat rooms"
    },
    {
      icon: <Key className="h-6 w-6 text-gray-600" />,
      title: "Private Rooms",
      description: "Create private rooms with unique codes for secure conversations"
    },
    {
      icon: <Zap className="h-6 w-6 text-gray-600" />,
      title: "Fast & Reliable",
      description: "Lightning-fast system powered by Socket.IO"
    },
    {
      icon: <Shield className="h-6 w-6 text-gray-700" />,
      title: "Secure",
      description: "Protected with JWT Authentication"
    },
    {
      icon: <Smartphone className="h-6 w-6 text-gray-700" />,
      title: "Responsive",
      description: "Works perfectly on all devices"
    },
    {
      icon: <Globe className="h-6 w-6 text-gray-700" />,
      title: "Modern UI",
      description: "Beautiful Apple iOS-inspired design"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Why Choose ChatApp?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Modern chat system with comprehensive features for seamless communication
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm bg-white/80 backdrop-blur-sm"
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">
                  {feature.icon}
                </div>
              </div>
              <CardTitle className="text-xl text-gray-900">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

