import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileSection } from './ProfileSection';
import { AddressSection } from './AddressSection';
import { SecuritySection } from './SecuritySection';

export function AccountSettingsContainer() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      <ProfileSection />
      <AddressSection />
      <SecuritySection />
    </div>
  );
}
