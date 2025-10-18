'use client';

import { MessageSquare, Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-6 w-6 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">ChatApp</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              A modern real-time chat application built for simplicity and speed. Connect with anyone, anywhere.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/register" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 ChatApp. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

