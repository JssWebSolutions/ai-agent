import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-100">
      <div className="px-4 py-2 space-y-1">
        <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
        <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Testimonials</a>
        <a href="/pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}