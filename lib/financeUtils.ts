import {
  Transaction,
  MonthlySummary,
  FinanceMetrics,
  ChartRange,
  CandleData,
} from './financeTypes';

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
 * Format large amounts compactly for chart axes (e.g. ₹50k, ₹1.5L, ₹1Cr).
 */
export const formatCompactINR = (amount: number): string => {
  if (amount === 0) return '0';
  const isNeg = amount < 0;
  const abs = Math.abs(amount);
  let str = `${abs}`;

  if (abs >= 10000000) {
    const v = abs / 10000000;
    str = `${v % 1 === 0 ? v : v.toFixed(1)}Cr`;
  } else if (abs >= 100000) {
    const v = abs / 100000;
    str = `${v % 1 === 0 ? v : v.toFixed(1)}L`;
  } else if (abs >= 1000) {
    const v = abs / 1000;
    str = `${v % 1 === 0 ? v : v.toFixed(1)}k`;
  }

  return isNeg ? `-${str}` : str;
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
 * Format 'YYYY-MM' to short month for chart X-axis (e.g. 'Oct' or 'Oct 25').
 */
export const formatShortMonth = (yearMonthStr: string, includeYear = false): string => {
  if (!yearMonthStr) return '';
  const parts = yearMonthStr.split('-');
  if (parts.length < 2) return yearMonthStr;
  const [y, m] = parts.map(Number);
  const date = new Date(y, m - 1, 1);

  if (includeYear) {
    const yrShort = String(y).slice(-2);
    const mStr = date.toLocaleDateString('en-IN', { month: 'short' });
    return `${mStr} '${yrShort}`;
  }

  return date.toLocaleDateString('en-IN', {
    month: 'short',
  });
};

/**
 * Returns continuous months between startKey and endKey (inclusive).
 * Format: 'YYYY-MM'
 */
export const getMonthsBetween = (startKey: string, endKey: string): string[] => {
  const [startYear, startMonth] = startKey.split('-').map(Number);
  const [endYear, endMonth] = endKey.split('-').map(Number);

  const result: string[] = [];
  const cur = new Date(startYear, startMonth - 1, 1);
  const end = new Date(endYear, endMonth - 1, 1);

  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    result.push(`${y}-${m}`);
    cur.setMonth(cur.getMonth() + 1);
  }
  return result;
};

/**
 * Returns an array of 'YYYY-MM' keys for the most recent `numMonths` months,
 * ending in the current calendar month in the user's local timezone.
 * Sorted chronologically from oldest to newest.
 */
export const getRecentMonthKeys = (numMonths: number = 6): string[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 to 11

  const keys: string[] = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    keys.push(`${y}-${m}`);
  }
  return keys;
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
 * Builds candlestick financial data (Open, Close, High, Low) for each month.
 *
 * Rules:
 * - Processes actual saved transactions in strict deterministic order (transaction_date, created_at, id).
 * - Tracks continuous cumulative available balance over time.
 * - Earliest displayed month accounts for running balance from all earlier transactions.
 * - For each month:
 *     Open: cumulative available balance at the start of that month.
 *     Close: cumulative available balance at the end of that month.
 *     High: peak running balance reached during that month.
 *     Low: lowest running balance reached during that month.
 * - If no transactions occurred in a month: open = close = high = low = priorClose.
 * - Candlestick is Green if close >= open, Red if close < open.
 */
export const calculateCandlestickData = (
  transactions: Transaction[],
  range: ChartRange = '6M'
): CandleData[] => {
  if (!transactions || transactions.length === 0) return [];

  // Deterministic chronological sort
  const sorted = [...transactions].sort((a, b) => {
    const dateComp = a.transaction_date.localeCompare(b.transaction_date);
    if (dateComp !== 0) return dateComp;
    const createdComp = (a.created_at || '').localeCompare(b.created_at || '');
    if (createdComp !== 0) return createdComp;
    return a.id.localeCompare(b.id);
  });

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentMonthKey = `${curYear}-${curMonth}`;

  // Determine months sequence
  let monthKeys: string[] = [];
  if (range === '6M') {
    monthKeys = getRecentMonthKeys(6);
  } else if (range === '1Y') {
    monthKeys = getRecentMonthKeys(12);
  } else {
    // ALL range: continuous timeline from earliest transaction month to current month
    const earliestMonthKey = sorted[0].transaction_date.slice(0, 7);
    const lastTxMonthKey = sorted[sorted.length - 1].transaction_date.slice(0, 7);
    const latestMonthKey = currentMonthKey >= lastTxMonthKey ? currentMonthKey : lastTxMonthKey;

    if (earliestMonthKey > latestMonthKey) {
      monthKeys = [currentMonthKey];
    } else {
      monthKeys = getMonthsBetween(earliestMonthKey, latestMonthKey);
      if (monthKeys.length < 6) {
        monthKeys = getRecentMonthKeys(6);
      }
    }
  }

  // Group transactions by month
  const txsByMonth: Record<string, Transaction[]> = {};
  for (const t of sorted) {
    const m = t.transaction_date.slice(0, 7);
    if (!txsByMonth[m]) txsByMonth[m] = [];
    txsByMonth[m].push(t);
  }

  // Calculate opening balance before the first displayed month
  const startMonthKey = monthKeys[0];
  let runningBalance = 0;
  for (const t of sorted) {
    const m = t.transaction_date.slice(0, 7);
    if (m < startMonthKey) {
      const amt = Number(t.amount) || 0;
      runningBalance += t.type === 'income' ? amt : -amt;
    } else {
      break;
    }
  }

  const spansMultipleYears =
    monthKeys.length > 0 &&
    monthKeys[0].slice(0, 4) !== monthKeys[monthKeys.length - 1].slice(0, 4);

  // Compute OHLC for each month
  const candles: CandleData[] = [];
  for (const m of monthKeys) {
    const open = runningBalance;
    let high = runningBalance;
    let low = runningBalance;

    const monthTxs = txsByMonth[m] || [];
    for (const t of monthTxs) {
      const amt = Number(t.amount) || 0;
      runningBalance += t.type === 'income' ? amt : -amt;
      if (runningBalance > high) high = runningBalance;
      if (runningBalance < low) low = runningBalance;
    }
    const close = runningBalance;
    const change = close - open;
    const changePercent =
      open !== 0 ? (change / Math.abs(open)) * 100 : close > 0 ? 100 : 0;

    candles.push({
      monthKey: m,
      monthLabel: formatMonthLabel(m),
      shortLabel: formatShortMonth(m, spansMultipleYears),
      open,
      close,
      high,
      low,
      change,
      changePercent,
      isBullish: close > open,
      isBearish: close < open,
      isNeutral: close === open,
      transactionCount: monthTxs.length,
    });
  }

  return candles;
};

/**
 * Returns all months that have recorded transactions,
 * sorted chronologically descending (newest month first) for table display.
 */
export const calculateMonthlyTableSummaries = (transactions: Transaction[]): MonthlySummary[] => {
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
