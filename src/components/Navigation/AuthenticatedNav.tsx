import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AuthenticatedNav() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center gap-4">
      {user ? (
        <>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link 
            to="/subscription" 
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Subscription
          </Link>
        </>
      ) : (
        <>
          <Link 
            to="/auth" 
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
          <Link 
            to="/plans" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Free Trial
          </Link>
        </>
      )}
    </nav>
  );
}