import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Transaction, 
  Category, 
  Account, 
  BudgetGoal, 
  AppSettings,
  DashboardData
} from '../types';
import { formatDateString } from '../utils/format';
import { downloadJSON } from '../utils/export';

// Default settings
const defaultSettings: AppSettings = {
  currency: 'USD',
  theme: 'system',
  dateFormat: 'yyyy-MM-dd',
  backupFrequency: 'weekly',
};

// Default categories
const defaultCategories: Category[] = [
  { id: uuidv4(), name: 'Salary', type: 'income', color: '#22c55e' },
  { id: uuidv4(), name: 'Freelance', type: 'income', color: '#16a34a' },
  { id: uuidv4(), name: 'Investments', type: 'income', color: '#4ade80' },
  { id: uuidv4(), name: 'Food & Dining', type: 'expense', color: '#ef4444' },
  { id: uuidv4(), name: 'Rent/Mortgage', type: 'expense', color: '#dc2626' },
  { id: uuidv4(), name: 'Utilities', type: 'expense', color: '#b91c1c' },
  { id: uuidv4(), name: 'Transportation', type: 'expense', color: '#f97316' },
  { id: uuidv4(), name: 'Shopping', type: 'expense', color: '#ea580c' },
  { id: uuidv4(), name: 'Entertainment', type: 'expense', color: '#fb923c' },
  { id: uuidv4(), name: 'Health', type: 'expense', color: '#a855f7' },
  { id: uuidv4(), name: 'Education', type: 'expense', color: '#8b5cf6' },
  { id: uuidv4(), name: 'Travel', type: 'expense', color: '#3b82f6' },
  { id: uuidv4(), name: 'Savings', type: 'expense', color: '#0ea5e9' },
];

// Default accounts
const defaultAccounts: Account[] = [
  { id: uuidv4(), name: 'Checking Account', balance: 5000, type: 'checking', color: '#3b82f6' },
  { id: uuidv4(), name: 'Savings Account', balance: 10000, type: 'savings', color: '#0ea5e9' },
  { id: uuidv4(), name: 'Credit Card', balance: -1500, type: 'credit', color: '#f97316' },
];

interface AppContextType {
  // Data
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgetGoals: BudgetGoal[];
  settings: AppSettings;
  
  // Dashboard data
  dashboardData: DashboardData;
  
  // Methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  
  addBudgetGoal: (goal: Omit<BudgetGoal, 'id'>) => void;
  updateBudgetGoal: (goal: BudgetGoal) => void;
  deleteBudgetGoal: (id: string) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  exportData: (format: 'json' | 'csv') => void;
  importData: (data: string, format: 'json' | 'csv') => void;
  backupData: () => void;
  restoreData: (backup: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Load data from localStorage or use defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('accounts');
    return saved ? JSON.parse(saved) : defaultAccounts;
  });
  
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() => {
    const saved = localStorage.getItem('budgetGoals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  // Calculate dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    budgetStatus: {
      allocated: 0,
      spent: 0,
      remaining: 0,
    },
    recentTransactions: [],
    upcomingRecurring: [],
  });
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('budgetGoals', JSON.stringify(budgetGoals));
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Update dashboard data
    updateDashboardData();
  }, [transactions, categories, accounts, budgetGoals, settings]);
  
  // Calculate dashboard data
  const updateDashboardData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    
    // Calculate totals
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate budget status
    const allocated = budgetGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const spent = totalExpenses;
    const remaining = allocated - spent;
    
    // Get recent transactions (last 5)
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    // Get upcoming recurring transactions
    const upcomingRecurring = transactions
      .filter(t => t.isRecurring && t.recurringDetails)
      .slice(0, 5);
    
    setDashboardData({
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      budgetStatus: {
        allocated,
        spent,
        remaining,
      },
      recentTransactions,
      upcomingRecurring,
    });
  };
  
  // Transaction methods
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
    
    // Update account balance
    if (transaction.type === 'income') {
      updateAccountBalance(transaction.accountId, transaction.amount);
    } else if (transaction.type === 'expense') {
      updateAccountBalance(transaction.accountId, -transaction.amount);
    }
  };
  
  const updateTransaction = (transaction: Transaction) => {
    // Find old transaction to revert account balance
    const oldTransaction = transactions.find(t => t.id === transaction.id);
    if (oldTransaction) {
      // Revert old transaction's effect on account balance
      if (oldTransaction.type === 'income') {
        updateAccountBalance(oldTransaction.accountId, -oldTransaction.amount);
      } else if (oldTransaction.type === 'expense') {
        updateAccountBalance(oldTransaction.accountId, oldTransaction.amount);
      }
      
      // Apply new transaction to account balance
      if (transaction.type === 'income') {
        updateAccountBalance(transaction.accountId, transaction.amount);
      } else if (transaction.type === 'expense') {
        updateAccountBalance(transaction.accountId, -transaction.amount);
      }
    }
    
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
  };
  
  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Revert transaction's effect on account balance
      if (transaction.type === 'income') {
        updateAccountBalance(transaction.accountId, -transaction.amount);
      } else if (transaction.type === 'expense') {
        updateAccountBalance(transaction.accountId, transaction.amount);
      }
    }
    
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  // Helper to update account balance
  const updateAccountBalance = (accountId: string, amountChange: number) => {
    setAccounts(accounts.map(account => {
      if (account.id === accountId) {
        return { ...account, balance: account.balance + amountChange };
      }
      return account;
    }));
  };
  
  // Category methods
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories([...categories, { ...category, id: uuidv4() }]);
  };
  
  const updateCategory = (category: Category) => {
    setCategories(categories.map(c => c.id === category.id ? category : c));
  };
  
  const deleteCategory = (id: string) => {
    // Check if category is used in any transactions
    const isUsed = transactions.some(t => t.categoryId === id);
    if (isUsed) {
      alert('Cannot delete category that is used in transactions');
      return;
    }
    
    setCategories(categories.filter(c => c.id !== id));
  };
  
  // Account methods
  const addAccount = (account: Omit<Account, 'id'>) => {
    setAccounts([...accounts, { ...account, id: uuidv4() }]);
  };
  
  const updateAccount = (account: Account) => {
    setAccounts(accounts.map(a => a.id === account.id ? account : a));
  };
  
  const deleteAccount = (id: string) => {
    // Check if account is used in any transactions
    const isUsed = transactions.some(t => t.accountId === id);
    if (isUsed) {
      alert('Cannot delete account that is used in transactions');
      return;
    }
    
    setAccounts(accounts.filter(a => a.id !== id));
  };
  
  // Budget goal methods
  const addBudgetGoal = (goal: Omit<BudgetGoal, 'id'>) => {
    setBudgetGoals([...budgetGoals, { ...goal, id: uuidv4() }]);
  };
  
  const updateBudgetGoal = (goal: BudgetGoal) => {
    setBudgetGoals(budgetGoals.map(g => g.id === goal.id ? goal : g));
  };
  
  const deleteBudgetGoal = (id: string) => {
    setBudgetGoals(budgetGoals.filter(g => g.id !== id));
  };
  
  // Settings methods
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };
  
  // Export data
  const exportData = (format: 'json' | 'csv') => {
    const data = {
      transactions,
      categories,
      accounts,
      budgetGoals,
      settings,
    };
    
    if (format === 'json') {
      downloadJSON(data, `budget-export-${formatDateString(new Date().toISOString())}`);
    } else if (format === 'csv') {
      // CSV export would be implemented here
      alert('CSV export not implemented yet');
    }
  };
  
  // Import data
  const importData = (data: string, format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        const parsedData = JSON.parse(data);
        
        if (parsedData.transactions) setTransactions(parsedData.transactions);
        if (parsedData.categories) setCategories(parsedData.categories);
        if (parsedData.accounts) setAccounts(parsedData.accounts);
        if (parsedData.budgetGoals) setBudgetGoals(parsedData.budgetGoals);
        if (parsedData.settings) setSettings(parsedData.settings);
        
        alert('Data imported successfully');
      } else if (format === 'csv') {
        // CSV import would be implemented here
        alert('CSV import not implemented yet');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data');
    }
  };
  
  // Backup data
  const backupData = () => {
    exportData('json');
    setSettings({
      ...settings,
      lastBackupDate: new Date().toISOString(),
    });
  };
  
  // Restore data
  const restoreData = (backup: string) => {
    importData(backup, 'json');
  };
  
  const value = {
    transactions,
    categories,
    accounts,
    budgetGoals,
    settings,
    dashboardData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    updateSettings,
    exportData,
    importData,
    backupData,
    restoreData,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 