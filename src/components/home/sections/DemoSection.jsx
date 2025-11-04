'use client';

import { MessageSquare } from 'lucide-react';

const DemoSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
            Take a look
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A clean interface that gets out of your way.
          </p>
        </div>

        {/* Preview Placeholder */}
        <div className="mt-8 rounded-2xl border border-black/10 bg-gradient-to-b from-white to-gray-50 aspect-video flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">App preview</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;

