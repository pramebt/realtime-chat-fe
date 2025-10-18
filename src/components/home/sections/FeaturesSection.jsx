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
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete chat solution with all the features you need, without the complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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

