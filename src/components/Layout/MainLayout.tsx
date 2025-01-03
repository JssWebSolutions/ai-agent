import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailVerificationBanner } from '../EmailVerificationBanner';
import { Header } from './Navigation/Header';
import { Sidebar } from './Navigation/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmailVerificationBanner />
      
      <Sidebar 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigation}
      />

      <div className="max-w-7xl mx-auto p-6">
        <Header 
          onMenuClick={() => setIsMenuOpen(true)}
          onAdminClick={() => navigate('/admin')}
          onSettingsClick={() => navigate('/settings')}
        />
        {children}
      </div>
    </div>
  );
}