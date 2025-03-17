import { ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import Card from '../UI/Card';

interface OverviewCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
}

export default function OverviewCard({ 
  title, 
  value, 
  icon, 
  change,
  color = 'primary',
  className = '',
}: OverviewCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const iconColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h4 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-full ${iconColorClass}`}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center">
          {change.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change.value)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
        </div>
      )}
    </Card>
  );
} 