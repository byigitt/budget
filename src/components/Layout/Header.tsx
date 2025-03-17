import { useState } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../UI/Modal';
import TransactionForm from '../Transactions/TransactionForm';
import { Transaction } from '../../types';

export default function Header() {
  const { settings, updateSettings, addTransaction } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
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

  const handleTransactionSubmit = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    setShowTransactionModal(false);
  };
  
  return (
    <header className="h-16 bg-card-light dark:bg-card-dark shadow-subtle border-b border-gray-100 dark:border-gray-800 fixed right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center w-96">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="search"
              className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-lg block w-full pl-10 p-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="bg-primary-600 hover:bg-primary-700 text-white py-1.5 px-3 rounded-lg flex items-center text-sm font-medium transition duration-150"
            onClick={() => setShowTransactionModal(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            <span>Add Transaction</span>
          </button>
          
          <div className="relative">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-expense rounded-full">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card-light dark:bg-card-dark shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 z-20">
                <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Your monthly budget report is ready</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">You're close to your shopping budget limit</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Automated savings transfer successful</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center">
                  <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60"
            onClick={toggleTheme}
          >
            {settings.theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex items-center pl-3 border-l border-gray-200 dark:border-gray-700">
            <img
              className="w-8 h-8 rounded-full"
              src="https://ui-avatars.com/api/?name=John+Doe&background=3d4a5c&color=fff"
              alt="User"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              John Doe
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Add Transaction"
        size="lg"
      >
        <TransactionForm 
          onSubmit={handleTransactionSubmit} 
          onCancel={() => setShowTransactionModal(false)} 
        />
      </Modal>
    </header>
  );
} 