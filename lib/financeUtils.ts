import { Transaction, MonthlySummary, FinanceMetrics } from './financeTypes';

/**
 * Format a number as Indian Rupee (INR) currency.
 * Uses standard Indian numbering system (e.g. ₹1,23,456.78 or ₹1,23,456).
 */
export const formatINR = (amount: number): string => {
  const isDecimal = amount % 1 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get current date as 'YYYY-MM-DD' formatted in user's local timezone.
 */
export const getTodayLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format 'YYYY-MM-DD' date string to human-readable local date (e.g. '15 Oct 2026').
 */
export const formatLocalDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format 'YYYY-MM' to readable month-year (e.g. 'Oct 2026').
 */
export const formatMonthLabel = (yearMonthStr: string): string => {
  if (!yearMonthStr) return '';
  const parts = yearMonthStr.split('-');
  if (parts.length < 2) return yearMonthStr;
  const [y, m] = parts.map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate the four required core dashboard metrics:
 * 1. Available balance (All-time income - All-time expenses)
 * 2. Income this month (Transactions in current calendar month in local timezone)
 * 3. Expenses this month (Transactions in current calendar month in local timezone)
 * 4. Total earned (Cumulative all-time income)
 */
export const calculateMetrics = (transactions: Transaction[]): FinanceMetrics => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let totalEarned = 0;
  let allTimeExpenses = 0;
  let incomeThisMonth = 0;
  let expensesThisMonth = 0;

  for (const t of transactions) {
    const amount = Number(t.amount) || 0;
    const isIncome = t.type === 'income';

    if (isIncome) {
      totalEarned += amount;
    } else {
      allTimeExpenses += amount;
    }

    if (t.transaction_date) {
      const [tYear, tMonth] = t.transaction_date.split('-').map(Number);
      if (tYear === currentYear && tMonth === currentMonth) {
        if (isIncome) {
          incomeThisMonth += amount;
        } else {
          expensesThisMonth += amount;
        }
      }
    }
  }

  const availableBalance = totalEarned - allTimeExpenses;

  return {
    availableBalance,
    incomeThisMonth,
    expensesThisMonth,
    totalEarned,
    allTimeExpenses,
  };
};

/**
 * Group transactions by month ('YYYY-MM') and compute income, expenses, and net.
 * Returns sorted chronologically descending by default (newest month first).
 */
export const calculateMonthlySummaries = (transactions: Transaction[]): MonthlySummary[] => {
  const monthMap: Record<string, { income: number; expenses: number }> = {};

  for (const t of transactions) {
    if (!t.transaction_date) continue;
    const parts = t.transaction_date.split('-');
    if (parts.length < 2) continue;
    const monthKey = `${parts[0]}-${parts[1]}`;

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expenses: 0 };
    }

    const amount = Number(t.amount) || 0;
    if (t.type === 'income') {
      monthMap[monthKey].income += amount;
    } else {
      monthMap[monthKey].expenses += amount;
    }
  }

  const keys = Object.keys(monthMap).sort((a, b) => b.localeCompare(a));

  return keys.map((key) => {
    const data = monthMap[key];
    return {
      monthKey: key,
      monthLabel: formatMonthLabel(key),
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    };
  });
};
