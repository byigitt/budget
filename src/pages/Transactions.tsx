import { useState, useMemo } from 'react';
import { PlusIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import { Transaction } from '../types';

// Type for sorting options
type SortOption = 'date' | 'amount' | 'description';
type SortDirection = 'asc' | 'desc';

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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
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
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <h2 className="text-lg font-medium mb-2 sm:mb-0">Filters</h2>
            {Object.values(filters).some(value => 
              value !== '' && value !== 'all'
            ) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search transactions..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Transaction type filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            {/* Category filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Account filter */}
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Account
              </label>
              <select
                id="account"
                value={filters.account}
                onChange={(e) => handleFilterChange('account', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All accounts</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filters */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                From
              </label>
              <input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                To
              </label>
              <input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
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