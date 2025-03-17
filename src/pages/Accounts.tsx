import { useState } from 'react';
import { PlusIcon, ArrowsRightLeftIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import { Account } from '../types';
import { formatCurrency } from '../utils/format';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onTransfer: (fromAccountId: string) => void;
}

function AccountCard({ account, onEdit, onDelete, onTransfer }: AccountCardProps) {
  return (
    <Card className="h-full">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: account.color }}
            >
              <BanknotesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {account.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onTransfer(account.id)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              title="Transfer"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(account)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex-grow">
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(account.balance)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <button
              onClick={() => onEdit(account)}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View transactions
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Mock transfer modal component
interface TransferModalProps {
  accounts: Account[];
  fromAccountId?: string;
  onSubmit: (fromAccountId: string, toAccountId: string, amount: number) => void;
  onCancel: () => void;
}

function TransferModal({ accounts, fromAccountId, onSubmit, onCancel }: TransferModalProps) {
  const [form, setForm] = useState({
    fromAccountId: fromAccountId || (accounts.length > 0 ? accounts[0].id : ''),
    toAccountId: '',
    amount: '',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.fromAccountId) {
      newErrors.fromAccountId = 'From account is required';
    }
    
    if (!form.toAccountId) {
      newErrors.toAccountId = 'To account is required';
    }
    
    if (form.fromAccountId === form.toAccountId) {
      newErrors.toAccountId = 'From and To accounts must be different';
    }
    
    if (!form.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(
        form.fromAccountId,
        form.toAccountId,
        parseFloat(form.amount)
      );
    }
  };
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-800 dark:opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Transfer Money
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* From Account */}
              <div>
                <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Account
                </label>
                <select
                  id="fromAccountId"
                  name="fromAccountId"
                  value={form.fromAccountId}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fromAccountId ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({formatCurrency(account.balance)})
                    </option>
                  ))}
                </select>
                {errors.fromAccountId && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromAccountId}</p>
                )}
              </div>
              
              {/* To Account */}
              <div>
                <label htmlFor="toAccountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Account
                </label>
                <select
                  id="toAccountId"
                  name="toAccountId"
                  value={form.toAccountId}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.toAccountId ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select an account</option>
                  {accounts
                    .filter(account => account.id !== form.fromAccountId)
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({formatCurrency(account.balance)})
                      </option>
                    ))}
                </select>
                {errors.toAccountId && (
                  <p className="mt-1 text-sm text-red-600">{errors.toAccountId}</p>
                )}
              </div>
              
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.amount ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Accounts() {
  const { accounts } = useAppContext();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedFromAccountId, setSelectedFromAccountId] = useState<string | undefined>(undefined);
  
  const handleOpenTransferModal = (fromAccountId: string) => {
    setSelectedFromAccountId(fromAccountId);
    setIsTransferModalOpen(true);
  };
  
  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
    setSelectedFromAccountId(undefined);
  };
  
  const handleTransfer = (fromAccountId: string, toAccountId: string, amount: number) => {
    console.log('Transfer', { fromAccountId, toAccountId, amount });
    // Will implement actual transfer functionality later
    handleCloseTransferModal();
  };
  
  const handleEditAccount = (account: Account) => {
    console.log('Edit account', account);
    // Will implement edit functionality later
  };
  
  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      console.log('Delete account', accountId);
      // Will implement delete functionality later
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Accounts</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Account
        </button>
      </div>
      
      {/* Accounts overview */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accounts</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {accounts.length}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Balance</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(accounts.length > 0 
                  ? accounts.reduce((sum, account) => sum + account.balance, 0) / accounts.length
                  : 0
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Accounts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <AccountCard 
            key={account.id}
            account={account}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onTransfer={handleOpenTransferModal}
          />
        ))}
        
        {accounts.length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              No accounts found. Get started by adding your first account.
            </div>
          </Card>
        )}
      </div>
      
      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <TransferModal 
          accounts={accounts}
          fromAccountId={selectedFromAccountId}
          onSubmit={handleTransfer}
          onCancel={handleCloseTransferModal}
        />
      )}
    </div>
  );
} 