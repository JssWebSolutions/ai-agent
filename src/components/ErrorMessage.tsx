import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  iconSize?: number; // Optional size for the icon
}

export function ErrorMessage({ message, iconSize = 20 }: ErrorMessageProps) {
  return (
    <div
      className="flex items-center gap-2 text-red-600"
      aria-live="assertive" // Ensures screen readers announce the error
    >
      <AlertCircle
        className="w-5 h-5"
        style={{ width: iconSize, height: iconSize }}
      />
      <span>{message}</span>
    </div>
  );
}
