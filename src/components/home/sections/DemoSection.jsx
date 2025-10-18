'use client';

import { MessageSquare, Users, Send } from 'lucide-react';

const DemoSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1 */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="h-16 w-16 bg-gray-900 rounded-xl flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Create an Account
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Sign up in seconds with just your email and username. No complex forms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="h-16 w-16 bg-gray-900 rounded-xl flex items-center justify-center mx-auto">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Create or Join a Room
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Start a new conversation or join existing rooms with a 6-digit code.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="h-16 w-16 bg-gray-900 rounded-xl flex items-center justify-center mx-auto">
                <Send className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Start Chatting
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Send messages instantly. Share ideas, collaborate, and connect.
            </p>
          </div>
        </div>

        {/* Preview Image Placeholder */}
        <div className="mt-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-video flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">App Preview</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;

