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
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  const iconColorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{title}</p>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{value}</h4>
        </div>
        <div className={`p-2 rounded-lg ${iconColorClass}`}>
          <div className="w-5 h-5">
            {icon}
          </div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          {change.isPositive ? (
            <ArrowUpIcon className="w-3.5 h-3.5 text-income mr-1" />
          ) : (
            <ArrowDownIcon className="w-3.5 h-3.5 text-expense mr-1" />
          )}
          <span className={`text-xs font-medium ${change.isPositive ? 'text-income' : 'text-expense'}`}>
            {Math.abs(change.value)}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">from previous period</span>
        </div>
      )}
    </Card>
  );
} 