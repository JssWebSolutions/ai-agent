import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailVerificationBanner } from '../EmailVerificationBanner';
import { UserMenu } from '../UserProfile/UserMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmailVerificationBanner />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Agent Manager</h1>
          <UserMenu
            onAdminClick={handleAdminClick}
            onSettingsClick={handleSettingsClick}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
