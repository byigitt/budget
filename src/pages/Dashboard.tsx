import { 
  WalletIcon, 
  BanknotesIcon, 
  ArrowTrendingDownIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import Card from '../components/UI/Card';
import OverviewCard from '../components/Dashboard/OverviewCard';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const { 
    dashboardData, 
    transactions, 
    categories, 
    accounts, 
    budgetGoals 
  } = useAppContext();
  
  // Generate expense by category chart data
  const expenseByCategory = categories
    .filter(category => category.type === 'expense')
    .map(category => {
      const amount = transactions
        .filter(t => t.categoryId === category.id && t.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      return {
        name: category.name,
        value: amount,
        color: category.color,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
  
  // For budget progress
  const totalSpent = dashboardData.budgetStatus.spent;
  const totalAllocated = dashboardData.budgetStatus.allocated;
  const budgetProgress = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your financial overview</p>
      </div>
      
      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <OverviewCard
          title="Total Balance"
          value={formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}
          icon={<WalletIcon />}
          change={{ value: 3.2, isPositive: true }}
          color="primary"
        />
        
        <OverviewCard
          title="Monthly Income"
          value={formatCurrency(dashboardData.totalIncome)}
          icon={<ArrowTrendingUpIcon />}
          color="green"
          change={{ value: 5.1, isPositive: true }}
        />
        
        <OverviewCard
          title="Monthly Expenses"
          value={formatCurrency(dashboardData.totalExpenses)}
          icon={<ArrowTrendingDownIcon />}
          color="red"
          change={{ value: 2.3, isPositive: false }}
        />
        
        <OverviewCard
          title="Net Savings"
          value={formatCurrency(dashboardData.netSavings)}
          icon={<BanknotesIcon />}
          color="blue"
          change={{ value: 7.5, isPositive: true }}
        />
      </div>
      
      {/* Charts and recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Expense by category */}
        <Card
          title="Expenses by Category"
          className="lg:col-span-1"
        >
          <div className="h-64">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={2}
                    cornerRadius={4}
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)} 
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #eceef2',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No expense data to display
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            {expenseByCategory.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-2.5 h-2.5 rounded-sm mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Budget progress */}
        <Card
          title="Budget Progress"
          className="lg:col-span-1"
        >
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-gray-700 dark:text-gray-300">Overall Budget</span>
                <span className="text-gray-900 dark:text-white font-medium">{budgetProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    budgetProgress > 90 ? 'bg-expense' : budgetProgress > 70 ? 'bg-yellow-500' : 'bg-income'
                  }`}
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span>Spent: {formatCurrency(totalSpent)}</span>
                <span>Budget: {formatCurrency(totalAllocated)}</span>
              </div>
            </div>
            
            {/* Individual budget goals */}
            <div className="space-y-5">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Budget Goals</h4>
              
              {budgetGoals.length > 0 ? (
                budgetGoals.slice(0, 3).map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{goal.name}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: goal.color 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>Current: {formatCurrency(goal.currentAmount)}</span>
                        <span>Target: {formatCurrency(goal.targetAmount)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                  No budget goals set
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Recent transactions */}
        <Card
          title="Recent Transactions"
          className="lg:col-span-1"
          footer={
            <div className="text-center">
              <a 
                href="/transactions" 
                className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
              >
                View all transactions
              </a>
            </div>
          }
        >
          {dashboardData.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => {
                const category = categories.find(c => c.id === transaction.categoryId);
                const isIncome = transaction.type === 'income';
                
                return (
                  <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category?.color || '#64748b' }}
                      >
                        <span className="text-white text-xs font-medium">
                          {category?.name.substring(0, 2).toUpperCase() || 'TX'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${isIncome ? 'text-income' : 'text-expense'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
              No recent transactions
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 