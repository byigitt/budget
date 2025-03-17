import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import { Transaction } from '../../types';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export default function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const { categories, accounts } = useAppContext();
  
  // Form state
  const [form, setForm] = useState({
    type: transaction?.type || 'expense',
    description: transaction?.description || '',
    amount: transaction?.amount ? transaction.amount.toString() : '',
    date: transaction?.date || new Date().toISOString().substring(0, 10),
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || (accounts.length > 0 ? accounts[0].id : ''),
    tags: transaction?.tags || [],
    notes: transaction?.notes || '',
    isRecurring: transaction?.isRecurring || false,
    recurringFrequency: transaction?.recurringFrequency || 'monthly',
    recurringEndDate: transaction?.recurringEndDate || '',
  });
  
  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tagInput, setTagInput] = useState('');
  
  // Filter categories by transaction type
  const filteredCategories = categories.filter(cat => cat.type === form.type);
  
  // Set default category when transaction type changes
  useEffect(() => {
    if (filteredCategories.length > 0 && (!form.categoryId || categories.find(c => c.id === form.categoryId)?.type !== form.type)) {
      setForm(prev => ({
        ...prev,
        categoryId: filteredCategories[0].id
      }));
    }
  }, [form.type, filteredCategories, form.categoryId, categories]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
  
  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };
  
  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!form.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!form.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!form.accountId) {
      newErrors.accountId = 'Account is required';
    }
    
    if (form.isRecurring && !form.recurringFrequency) {
      newErrors.recurringFrequency = 'Frequency is required for recurring transactions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        type: form.type as 'income' | 'expense',
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
        categoryId: form.categoryId,
        accountId: form.accountId,
        tags: form.tags,
        notes: form.notes,
        isRecurring: form.isRecurring,
        recurringFrequency: form.isRecurring ? form.recurringFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly' : undefined,
        recurringEndDate: form.isRecurring ? form.recurringEndDate : undefined,
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 text-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      
      {/* Transaction Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Transaction Type</label>
        <div className="flex gap-4">
          <label className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${form.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={form.type === 'expense'}
              onChange={handleChange}
              className="sr-only"
            />
            <span>Expense</span>
          </label>
          <label className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${form.type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={form.type === 'income'}
              onChange={handleChange}
              className="sr-only"
            />
            <span>Income</span>
          </label>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What was this transaction for?"
          className={`py-3 px-4 block w-full rounded-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary-500 shadow-sm ${errors.description ? 'ring-1 ring-red-500' : ''}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>
      
      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={`py-3 px-4 block w-full rounded-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary-500 shadow-sm ${errors.amount ? 'ring-1 ring-red-500' : ''}`}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
        )}
      </div>
      
      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-300">
          Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`pl-10 py-3 block w-full rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm ${errors.date ? 'ring-1 ring-red-500' : ''}`}
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-sm text-red-400">{errors.date}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <div className="relative">
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className={`py-3 px-4 block w-full appearance-none rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm pr-10 ${errors.categoryId ? 'ring-1 ring-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-400">{errors.categoryId}</p>
          )}
        </div>
        
        {/* Account */}
        <div className="space-y-2">
          <label htmlFor="accountId" className="block text-sm font-medium text-gray-300">
            Account
          </label>
          <div className="relative">
            <select
              id="accountId"
              name="accountId"
              value={form.accountId}
              onChange={handleChange}
              className={`py-3 px-4 block w-full appearance-none rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm pr-10 ${errors.accountId ? 'ring-1 ring-red-500' : ''}`}
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.accountId && (
            <p className="mt-1 text-sm text-red-400">{errors.accountId}</p>
          )}
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
          Tags
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tags and press Enter"
            className="py-3 px-4 block w-full rounded-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary-500 shadow-sm"
          />
          <button
            type="button"
            onClick={addTag}
            className="inline-flex items-center px-3 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        
        {form.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-gray-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 text-gray-400 hover:text-gray-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Add any additional notes..."
          className="py-3 px-4 block w-full rounded-lg border-0 bg-gray-700 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary-500 shadow-sm resize-none"
        />
      </div>
      
      {/* Recurring Transaction */}
      <div className="pt-3">
        <div className="flex items-center">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={form.isRecurring}
            onChange={handleChange}
            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-500 rounded bg-gray-700"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-300">
            This is a recurring transaction
          </label>
        </div>
        
        {form.isRecurring && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
            <div className="space-y-2">
              <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-300">
                Frequency
              </label>
              <div className="relative">
                <select
                  id="recurringFrequency"
                  name="recurringFrequency"
                  value={form.recurringFrequency}
                  onChange={handleChange}
                  className="py-3 px-4 block w-full appearance-none rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm pr-10"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-300">
                End Date (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  id="recurringEndDate"
                  name="recurringEndDate"
                  value={form.recurringEndDate}
                  onChange={handleChange}
                  className="pl-10 py-3 block w-full rounded-lg border-0 bg-gray-700 text-white focus:ring-1 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4 mt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
} 