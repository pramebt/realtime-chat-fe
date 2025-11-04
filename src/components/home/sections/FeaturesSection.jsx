'use client';

import { Zap, Lock, Users, MessageSquare, Bell, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time messaging with instant delivery. No delays, no waiting.'
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'End-to-end encryption keeps your conversations private and secure.'
  },
  {
    icon: Users,
    title: 'Room-Based Chat',
    description: 'Create public or private rooms. Invite friends with a simple code.'
  },
  {
    icon: MessageSquare,
    title: 'Simple Interface',
    description: 'Clean, intuitive design that gets out of your way.'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay updated without being overwhelmed. You control what you see.'
  },
  {
    icon: Sparkles,
    title: 'Modern Experience',
    description: 'Built with the latest technology for a smooth experience.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-28 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features, thoughtfully minimal.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-start"
              >
                <div className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-gray-900" />
                </div>
                <h3 className="text-base font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

