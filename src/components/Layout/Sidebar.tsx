import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BanknotesIcon, 
  ChartPieIcon, 
  CreditCardIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Transactions', path: '/transactions', icon: BanknotesIcon },
  { name: 'Budgets', path: '/budgets', icon: ChartPieIcon },
  { name: 'Accounts', path: '/accounts', icon: CreditCardIcon },
  { name: 'Goals', path: '/goals', icon: ArrowTrendingUpIcon },
  { name: 'Reports', path: '/reports', icon: DocumentTextIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="w-64 h-screen bg-card-light dark:bg-card-dark border-r border-gray-100 dark:border-gray-800 overflow-y-auto fixed">
      <div className="flex items-center justify-center h-16 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-medium text-gray-900 dark:text-white">
          <span className="text-primary-700 dark:text-primary-400">Finance</span>Track
        </h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-500'}`} />
                  <span className={`font-medium text-sm ${isActive ? 'font-medium' : ''}`}>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-3 mt-12">
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Storage</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1.5">
              <div className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>7.5 MB used</span>
              <span>10 MB limit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 