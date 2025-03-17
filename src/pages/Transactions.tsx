import { useState, useMemo, useRef, useEffect } from 'react';
import { PlusIcon, ArrowDownIcon, ArrowUpIcon, FunnelIcon, XMarkIcon, MagnifyingGlassIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import { Transaction } from '../types';

// Type for sorting options
type SortOption = 'date' | 'amount' | 'description';
type SortDirection = 'asc' | 'desc';

// Custom dropdown component
interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

function CustomDropdown({ options, value, onChange, label, id }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className="py-3 px-4 block w-full text-left rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span>{selectedOption.label}</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-gray-800 shadow-lg">
            <ul 
              className="max-h-60 overflow-auto rounded-md py-1 text-base focus:outline-none sm:text-sm"
              tabIndex={-1}
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  className={`cursor-pointer select-none relative py-3 px-4 hover:bg-blue-600 ${
                    option.value === value ? 'bg-blue-500 text-white' : 'text-gray-200'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Transactions() {
  const { transactions, categories, accounts, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    account: 'all',
    startDate: '',
    endDate: '',
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Toggle sort direction or set new sort field
  const handleSort = (field: SortOption) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Update filter values
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      account: 'all',
      startDate: '',
      endDate: '',
    });
  };
  
  // Apply filters and sorting to transactions
  const filteredAndSortedTransactions = useMemo(() => {
    // First, filter the transactions
    let filtered = [...transactions];
    
    // Filter by search term (description or tags)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) || 
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by transaction type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.categoryId === filters.category);
    }
    
    // Filter by account
    if (filters.account !== 'all') {
      filtered = filtered.filter(t => t.accountId === filters.account);
    }
    
    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate);
    }
    
    // Then, sort the filtered results
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [transactions, filters, sortBy, sortDirection]);
  
  // Handle add/edit transaction
  const handleOpenModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };
  
  const handleTransactionSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction({
        ...transactionData,
        id: editingTransaction.id
      });
    } else {
      addTransaction(transactionData);
    }
    handleCloseModal();
  };
  
  // Handlers for transaction actions
  const handleEditTransaction = (transaction: Transaction) => {
    handleOpenModal(transaction);
  };
  
  const handleDeleteTransaction = (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transactionId);
    }
  };
  
  // Add a handler for custom dropdowns
  const handleDropdownChange = (key: keyof typeof filters, value: string) => {
    handleFilterChange(key, value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Transactions</h1>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>
      
      {/* Filters */}
      <Card className="bg-gray-800 text-white border-0">
        <div className="p-5">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-3 border-b border-gray-700">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
              <h2 className="text-lg font-medium">Filters</h2>
            </div>
            {Object.values(filters).some(value => 
              value !== '' && value !== 'all'
            ) && (
              <button
                onClick={clearFilters}
                className="mt-2 sm:mt-0 text-sm flex items-center text-primary-400 hover:text-primary-300"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search input */}
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search transactions..."
                  className="pl-10 py-3 block w-full rounded-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>
            
            {/* Filter by type with custom dropdown */}
            <CustomDropdown
              id="type"
              label="Transaction Type"
              value={filters.type}
              onChange={(value) => handleDropdownChange('type', value)}
              options={[
                { value: 'all', label: 'All types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
            />
            
            {/* Filter by category with custom dropdown */}
            <CustomDropdown
              id="category"
              label="Category"
              value={filters.category}
              onChange={(value) => handleDropdownChange('category', value)}
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map(category => ({
                  value: category.id,
                  label: category.name
                }))
              ]}
            />
            
            {/* Filter by account with custom dropdown */}
            <CustomDropdown
              id="account"
              label="Account"
              value={filters.account}
              onChange={(value) => handleDropdownChange('account', value)}
              options={[
                { value: 'all', label: 'All accounts' },
                ...accounts.map(account => ({
                  value: account.id,
                  label: account.name
                }))
              ]}
            />
            
            {/* Date range filters */}
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                From Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="pl-10 py-3 block w-full rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                To Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="pl-10 py-3 block w-full rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Active filters */}
          {Object.values(filters).some(value => value !== '' && value !== 'all') && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-400">Active filters:</span>
                {filters.type !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    Type: {filters.type}
                    <button 
                      onClick={() => handleFilterChange('type', 'all')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    Category: {categories.find(c => c.id === filters.category)?.name || 'Unknown'}
                    <button 
                      onClick={() => handleFilterChange('category', 'all')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {filters.account !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    Account: {accounts.find(a => a.id === filters.account)?.name || 'Unknown'}
                    <button 
                      onClick={() => handleFilterChange('account', 'all')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {filters.startDate && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    From: {filters.startDate}
                    <button 
                      onClick={() => handleFilterChange('startDate', '')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {filters.endDate && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    To: {filters.endDate}
                    <button 
                      onClick={() => handleFilterChange('endDate', '')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                    Search: "{filters.search}"
                    <button 
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1.5 text-gray-400 hover:text-gray-200"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Transaction list */}
      <Card>
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-lg font-medium">
              {filteredAndSortedTransactions.length} {filteredAndSortedTransactions.length === 1 ? 'Transaction' : 'Transactions'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
              onClick={() => handleSort('date')}
            >
              Date
              {sortBy === 'date' && (
                sortDirection === 'desc' 
                  ? <ArrowDownIcon className="w-4 h-4 ml-1" />
                  : <ArrowUpIcon className="w-4 h-4 ml-1" />
              )}
            </button>
            <button
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
              onClick={() => handleSort('amount')}
            >
              Amount
              {sortBy === 'amount' && (
                sortDirection === 'desc' 
                  ? <ArrowDownIcon className="w-4 h-4 ml-1" />
                  : <ArrowUpIcon className="w-4 h-4 ml-1" />
              )}
            </button>
            <button
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center"
              onClick={() => handleSort('description')}
            >
              Description
              {sortBy === 'description' && (
                sortDirection === 'desc' 
                  ? <ArrowDownIcon className="w-4 h-4 ml-1" />
                  : <ArrowUpIcon className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>
        </div>
        <TransactionList 
          transactions={filteredAndSortedTransactions}
          categories={categories}
          accounts={accounts}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </Card>
      
      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-800 dark:opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <div className="mt-4">
                  <TransactionForm 
                    transaction={editingTransaction}
                    onSubmit={handleTransactionSubmit}
                    onCancel={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 