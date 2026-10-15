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

export type ChartRange = '6M' | '1Y' | 'ALL';

export interface CandleData {
  monthKey: string; // 'YYYY-MM'
  monthLabel: string; // 'Oct 2026'
  shortLabel: string; // 'Oct' or 'Oct 25'
  open: number;
  close: number;
  high: number;
  low: number;
  change: number; // close - open
  changePercent: number;
  isBullish: boolean;
  isBearish: boolean;
  isNeutral: boolean;
  transactionCount: number;
}
