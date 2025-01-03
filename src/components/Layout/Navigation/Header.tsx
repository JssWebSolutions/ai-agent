import { Menu } from 'lucide-react';
import { UserMenu } from '../../UserProfile/UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
  onAdminClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ onMenuClick, onAdminClick, onSettingsClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">AI Agent Manager</h1>
      </div>
      <UserMenu
        onAdminClick={onAdminClick}
        onSettingsClick={onSettingsClick}
      />
    </div>
  );
}