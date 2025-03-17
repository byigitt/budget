import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Transaction, Category, Account } from '../../types';
import { formatCurrency, formatDateString } from '../../utils/format';
import Badge from '../UI/Badge';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  limit?: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

export default function TransactionList({ 
  transactions, 
  categories, 
  accounts,
  limit,
  onEdit,
  onDelete
}: TransactionListProps) {
  // Get display transactions (with optional limit)
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  // Helper to get category by ID
  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(category => category.id === categoryId);
  };
  
  // Helper to get account by ID
  const getAccountById = (accountId: string): Account | undefined => {
    return accounts.find(account => account.id === accountId);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction) => {
              const category = getCategoryById(transaction.categoryId);
              const account = getAccountById(transaction.accountId);
              const isIncome = transaction.type === 'income';
              
              return (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <td className="px-4 py-3 text-sm">
                    {formatDateString(transaction.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    {transaction.tags.length > 0 && (
                      <div className="flex mt-1 space-x-1">
                        {transaction.tags.slice(0, 2).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="neutral" 
                            size="sm"
                            rounded
                          >
                            {tag}
                          </Badge>
                        ))}
                        {transaction.tags.length > 2 && (
                          <Badge variant="neutral" size="sm" rounded>
                            +{transaction.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {category && (
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {account?.name || 'Unknown Account'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${isIncome ? 'text-income' : 'text-expense'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle dropdown menu
                        }}
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>
                      {/* Dropdown menu */}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 