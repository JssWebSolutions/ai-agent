import React from 'react';
import { cn } from '../../../utils/cn';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-gray-200 hover:border-blue-500/50 transition-all",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}