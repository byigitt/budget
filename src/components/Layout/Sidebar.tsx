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
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto fixed">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">BudgetTracker</h1>
      </div>
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 