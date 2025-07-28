import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 min-w-[280px] flex-1 ${className}`}>
      <div className="flex items-center space-x-3">
        <Icon className="w-8 h-8 text-green-600" />
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};