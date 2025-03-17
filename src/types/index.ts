export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  tags: string[];
  isRecurring: boolean;
  recurringDetails?: RecurringDetails;
  receiptUrl?: string;
}

export interface RecurringDetails {
  frequency:
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "quarterly"
    | "yearly";
  endDate?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: "checking" | "savings" | "credit" | "investment" | "cash";
  color: string;
}

export interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  categoryId?: string;
  color: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetStatus: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  recentTransactions: Transaction[];
  upcomingRecurring: Transaction[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface AppSettings {
  currency: string;
  theme: "light" | "dark" | "system";
  dateFormat: string;
  backupFrequency: "daily" | "weekly" | "monthly" | "manual";
  lastBackupDate?: string;
}

export interface Report {
  title: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
  };
  categorySummary: CategorySummary[];
  transactions: Transaction[];
}

export interface Forecast {
  months: string[];
  incomeProjection: number[];
  expenseProjection: number[];
  savingsProjection: number[];
  balanceProjection: number[];
}
