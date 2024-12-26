import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailVerificationBanner } from '../EmailVerificationBanner';
import { UserMenu } from '../UserProfile/UserMenu';
import { Menu, Home, Users, Settings, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'All Agents', path: '/agent' },
    { icon: Settings, label: 'Account Settings', path: '/settings' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmailVerificationBanner />
      
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Off-canvas Menu */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">AI Agent Manager</h1>
          </div>
          <UserMenu
            onAdminClick={() => navigate('/admin')}
            onSettingsClick={() => navigate('/settings')}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
