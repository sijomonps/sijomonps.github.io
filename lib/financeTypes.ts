export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  title: string;
  amount: number;
  transaction_date: string; // 'YYYY-MM-DD'
  created_at: string;
}

export interface MonthlySummary {
  monthKey: string; // 'YYYY-MM'
  monthLabel: string; // 'Oct 2026'
  income: number;
  expenses: number;
  net: number;
}

export interface FinanceMetrics {
  availableBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  totalEarned: number;
  allTimeExpenses: number;
}
