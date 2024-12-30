import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Product</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Documentation</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Status</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Connect</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Agent Manager. All rights reserved.
        </p>
        <p className="mt-4 text-sm">
          Built with ❤️ by <a href="#" className="hover:text-blue-500">JSS Web Solutions</a>
        </p>
      </div>
    </footer>
  );
}