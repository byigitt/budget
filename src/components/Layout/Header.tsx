import { useState } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';

export default function Header() {
  const { settings, updateSettings } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
    
    // Also update document class for dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center w-96">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Transaction</span>
          </button>
          
          <div className="relative">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-20">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm">Your monthly budget report is ready</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm">You're close to your shopping budget limit</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <p className="text-sm">Automated savings transfer successful</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-primary-500 text-sm hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-2"
            onClick={toggleTheme}
          >
            {settings.theme === 'dark' ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full"
              src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
              alt="User"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
} 