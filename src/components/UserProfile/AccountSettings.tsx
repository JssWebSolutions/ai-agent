import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Key, Phone, MapPin, Upload, X, ArrowLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { uploadProfileImage } from '../../services/storage/profileImage';
import { useNavigate } from 'react-router-dom';

export function AccountSettings() {
  // ... existing state and hooks ...
  const navigate = useNavigate();

  // Add this at the top of the component
  const handleBackToDashboard = () => {
    navigate('/user');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Add Dashboard Menu */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Rest of the existing AccountSettings content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {/* ... existing content ... */}
      </div>
    </div>
  );
}
