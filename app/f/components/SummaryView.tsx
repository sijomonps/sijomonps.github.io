'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, FinanceMetrics, ChartRange } from '@/lib/financeTypes';
import {
  formatINR,
  formatCompactINR,
  calculateCandlestickData,
  calculateMonthlyTableSummaries,
} from '@/lib/financeUtils';
import {
  FiActivity,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

interface SummaryViewProps {
  metrics?: FinanceMetrics;
  transactions: Transaction[];
}

const BREAKDOWN_PAGE_SIZE = 6;

export default function SummaryView({
  transactions,
}: SummaryViewProps) {
  // Chart range controls: '6M' | '1Y' | 'ALL'
  const [range, setRange] = useState<ChartRange>('6M');

  // Compute candlestick data based on actual transactions
  const candles = useMemo(() => {
    return calculateCandlestickData(transactions, range);
  }, [transactions, range]);

  // Table breakdown sorted newest first
  const tableData = useMemo(() => {
    return calculateMonthlyTableSummaries(transactions);
  }, [transactions]);

  // Breakdown pagination state
  const [breakdownPage, setBreakdownPage] = useState(1);
  const totalBreakdownPages = Math.ceil(tableData.length / BREAKDOWN_PAGE_SIZE) || 1;
  const safeBreakdownPage = Math.min(Math.max(1, breakdownPage), totalBreakdownPages);

  const breakdownStartIndex = (safeBreakdownPage - 1) * BREAKDOWN_PAGE_SIZE;
  const breakdownEndIndex = Math.min(
    breakdownStartIndex + BREAKDOWN_PAGE_SIZE,
    tableData.length
  );
  const paginatedTableData = useMemo(() => {
    return tableData.slice(breakdownStartIndex, breakdownEndIndex);
  }, [tableData, breakdownStartIndex, breakdownEndIndex]);

  // Interactive selected candle key
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

  // Derive selected candle object (defaults to latest active month or latest candle)
  const selectedCandle = useMemo(() => {
    if (candles.length === 0) return null;
    if (selectedMonthKey) {
      const found = candles.find((c) => c.monthKey === selectedMonthKey);
      if (found) return found;
    }
    // Default to the last candle with transactions or the latest candle in range
    const lastWithTx = [...candles].reverse().find((c) => c.transactionCount > 0);
    return lastWithTx || candles[candles.length - 1];
  }, [candles, selectedMonthKey]);

  const hasAnyTransactions = transactions.length > 0;

  // Calculate Y-axis bounds (min and max balances reached in the range)
  const { yMin, yMax } = useMemo(() => {
    if (candles.length === 0) {
      return { yMin: 0, yMax: 1000 };
    }
    let min = Math.min(...candles.map((c) => c.low));
    let max = Math.max(...candles.map((c) => c.high));

    if (min === max) {
      min -= 1000;
      max += 1000;
    }

    const span = max - min || 1000;
    const padding = span * 0.12; // 12% padding for wicks breathing room
    return {
      yMin: min - padding,
      yMax: max + padding,
    };
  }, [candles]);

  // Chart layout dimensions
  const leftMargin = 50;
  const rightMargin = 20;
  const topMargin = 25;
  const baselineY = 220;
  const plotHeight = baselineY - topMargin;

  // Candle width and spacing
  const numCandles = candles.length;
  // If ALL has many candles, expand SVG width to enable smooth chart-internal scroll
  const minColumnWidth = numCandles > 12 ? 38 : numCandles > 6 ? 48 : 72;
  const svgWidth = Math.max(640, leftMargin + rightMargin + numCandles * minColumnWidth);
  const plotWidth = svgWidth - leftMargin - rightMargin;
  const colWidth = numCandles > 0 ? plotWidth / numCandles : 0;

  const candleBodyWidth =
    numCandles > 12 ? 14 : numCandles > 6 ? 20 : 28;

  // Helper to map a balance value to Y coordinate
  const getY = (val: number): number => {
    if (yMax === yMin) return baselineY - plotHeight / 2;
    const pct = (val - yMin) / (yMax - yMin);
    return baselineY - pct * plotHeight;
  };

  // Y-axis tick values (4 clean grid levels)
  const yTicks = useMemo(() => {
    const ticks = [
      yMax - (yMax - yMin) * 0.05,
      yMin + (yMax - yMin) * 0.66,
      yMin + (yMax - yMin) * 0.33,
      yMin + (yMax - yMin) * 0.05,
    ];
    return ticks;
  }, [yMin, yMax]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Candlestick Financial Chart Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Card Header: Title, Range Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FiActivity className="h-4 w-4 text-emerald-400 shrink-0" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Balance History
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              Monthly opening, closing, high and low balances
            </p>
          </div>

          {/* Range Controls: 6M / 1Y / ALL */}
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-0.5 text-xs font-semibold self-start sm:self-auto">
            {(['6M', '1Y', 'ALL'] as ChartRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  range === r
                    ? 'bg-white/10 text-foreground shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {!hasAnyTransactions ? (
          <div className="py-14 sm:py-16 text-center px-4">
            <div className="h-10 w-10 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
              <FiActivity className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              No transactions recorded yet
            </p>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              Add your first income or expense transaction to generate your personal balance candlestick chart.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Terminal OHLC Live Bar (TradingView style status strip) */}
            {selectedCandle && (
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-xl border border-white/5 bg-black/40 px-3.5 py-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-xs uppercase tracking-wide">
                    {selectedCandle.monthLabel}
                  </span>
                  {selectedCandle.transactionCount === 0 && (
                    <span className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                      Unchanged
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-5 text-[11px] sm:text-xs">
                  <div>
                    <span className="text-zinc-500 mr-1">O:</span>
                    <span className="text-zinc-300 font-semibold">
                      {formatINR(selectedCandle.open)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 mr-1">H:</span>
                    <span className="text-emerald-400/90 font-semibold">
                      {formatINR(selectedCandle.high)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 mr-1">L:</span>
                    <span className="text-rose-400/90 font-semibold">
                      {formatINR(selectedCandle.low)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 mr-1">C:</span>
                    <span
                      className={`font-semibold ${
                        selectedCandle.isBullish
                          ? 'text-emerald-400'
                          : selectedCandle.isBearish
                          ? 'text-rose-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      {formatINR(selectedCandle.close)}
                    </span>
                  </div>
                  <div className="hidden min-[420px]:block">
                    <span className="text-zinc-500 mr-1">CHG:</span>
                    <span
                      className={`font-semibold ${
                        selectedCandle.change > 0
                          ? 'text-emerald-400'
                          : selectedCandle.change < 0
                          ? 'text-rose-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {selectedCandle.change >= 0 ? '+' : ''}
                      {formatINR(selectedCandle.change)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Candlestick Chart Area (Chart-internal horizontal scroll if ALL is wide) */}
            <div className="w-full overflow-x-auto select-none works-scrollbar-hidden rounded-xl border border-white/5 bg-black/30 p-2 sm:p-3">
              <svg
                viewBox={`0 0 ${svgWidth} 260`}
                style={{ minWidth: numCandles > 12 ? `${svgWidth}px` : '100%' }}
                className="w-full h-64 sm:h-72"
              >
                {/* Horizontal reference gridlines & Y-axis price labels */}
                {yTicks.map((val, idx) => {
                  const y = getY(val);
                  return (
                    <g key={idx}>
                      <line
                        x1={leftMargin}
                        y1={y}
                        x2={svgWidth - rightMargin}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={leftMargin - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        className="fill-zinc-500 text-[10px] font-mono"
                      >
                        ₹{formatCompactINR(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Zero baseline indicator (if 0 is within yMin and yMax) */}
                {yMin <= 0 && yMax >= 0 && (
                  <line
                    x1={leftMargin}
                    y1={getY(0)}
                    x2={svgWidth - rightMargin}
                    y2={getY(0)}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeDasharray="2 2"
                  />
                )}

                {/* X-axis baseline */}
                <line
                  x1={leftMargin}
                  y1={baselineY}
                  x2={svgWidth - rightMargin}
                  y2={baselineY}
                  stroke="rgba(255, 255, 255, 0.12)"
                />

                {/* Render Candlesticks */}
                {candles.map((c, i) => {
                  const cx = leftMargin + i * colWidth + colWidth / 2;
                  const isSelected = selectedCandle?.monthKey === c.monthKey;

                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);
                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);

                  // Colors: Green for up, Red for down, Zinc for neutral
                  const candleColor = c.isBullish
                    ? '#10b981'
                    : c.isBearish
                    ? '#f43f5e'
                    : '#71717a';

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2.5, Math.abs(yClose - yOpen));

                  return (
                    <g key={c.monthKey} className="transition-opacity">
                      {/* Active column highlight */}
                      {isSelected && (
                        <rect
                          x={cx - colWidth / 2 + 1}
                          y={topMargin - 5}
                          width={colWidth - 2}
                          height={plotHeight + 35}
                          rx={4}
                          fill="rgba(255, 255, 255, 0.04)"
                        />
                      )}

                      {/* Active Crosshair guides */}
                      {isSelected && (
                        <>
                          <line
                            x1={cx}
                            y1={topMargin}
                            x2={cx}
                            y2={baselineY}
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeDasharray="2 2"
                          />
                          <line
                            x1={leftMargin}
                            y1={yClose}
                            x2={svgWidth - rightMargin}
                            y2={yClose}
                            stroke={candleColor}
                            strokeOpacity="0.4"
                            strokeDasharray="2 2"
                          />
                        </>
                      )}

                      {/* Wick Line (extends from low to high) */}
                      {yHigh !== yLow ? (
                        <line
                          x1={cx}
                          y1={yHigh}
                          x2={cx}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      ) : null}

                      {/* Candle Body */}
                      {c.isNeutral ? (
                        /* Flat doji dash for unchanged balance */
                        <line
                          x1={cx - candleBodyWidth / 2}
                          y1={yOpen}
                          x2={cx + candleBodyWidth / 2}
                          y2={yOpen}
                          stroke={candleColor}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      ) : (
                        <rect
                          x={cx - candleBodyWidth / 2}
                          y={bodyTop}
                          width={candleBodyWidth}
                          height={bodyHeight}
                          rx={2}
                          fill={candleColor}
                          stroke={candleColor}
                          strokeWidth="0.5"
                          className="transition-all duration-150"
                        />
                      )}

                      {/* Month Label below baseline */}
                      <text
                        x={cx}
                        y={baselineY + 18}
                        textAnchor="middle"
                        className={`text-[10px] sm:text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'fill-foreground font-semibold'
                            : 'fill-zinc-400'
                        }`}
                      >
                        {c.shortLabel}
                      </text>

                      {/* Transparent touch & hover hitbox */}
                      <rect
                        x={cx - colWidth / 2}
                        y={topMargin - 10}
                        width={colWidth}
                        height={plotHeight + 45}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setSelectedMonthKey(c.monthKey)}
                        onClick={() => setSelectedMonthKey(c.monthKey)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Compact Candlestick Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-zinc-400 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-4">
                {/* Bullish Legend */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-3 h-3">
                    <span className="w-2 h-2.5 rounded-sm bg-emerald-500" />
                  </div>
                  <span>Green = Net Gain (Close ≥ Open)</span>
                </div>

                {/* Bearish Legend */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-3 h-3">
                    <span className="w-2 h-2.5 rounded-sm bg-rose-500" />
                  </div>
                  <span>Red = Net Decrease (Close &lt; Open)</span>
                </div>

                {/* Neutral Legend */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-zinc-500 rounded-full" />
                  <span>Dash = Unchanged</span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 hidden sm:block">
                Wicks represent monthly high & low balance range
              </div>
            </div>

            {/* Selected Month Detailed Card (Touch-friendly & stays within viewport) */}
            {selectedCandle && (
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 sm:p-4 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-foreground">
                        {selectedCandle.monthLabel}
                      </span>
                      <span className="text-[11px] text-zinc-500 ml-2">
                        {selectedCandle.transactionCount}{' '}
                        {selectedCandle.transactionCount === 1
                          ? 'transaction'
                          : 'transactions'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                      Monthly Movement:
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-semibold font-mono tabular-nums ${
                        selectedCandle.change > 0
                          ? 'text-emerald-400'
                          : selectedCandle.change < 0
                          ? 'text-rose-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      {selectedCandle.change >= 0 ? '+' : ''}
                      {formatINR(selectedCandle.change)}
                      {selectedCandle.open !== 0 && (
                        <span className="text-[11px] opacity-80 ml-1">
                          ({selectedCandle.changePercent >= 0 ? '+' : ''}
                          {selectedCandle.changePercent.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 4 OHLC Balance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-3 font-mono">
                  <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                      Opening Balance
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200 tabular-nums">
                      {formatINR(selectedCandle.open)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                      Peak Balance (High)
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-400 tabular-nums">
                      {formatINR(selectedCandle.high)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                      Lowest Balance (Low)
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-rose-400 tabular-nums">
                      {formatINR(selectedCandle.low)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] border border-white/5 p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                      Closing Balance
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-semibold tabular-nums ${
                        selectedCandle.isBullish
                          ? 'text-emerald-400'
                          : selectedCandle.isBearish
                          ? 'text-rose-400'
                          : 'text-zinc-200'
                      }`}
                    >
                      {formatINR(selectedCandle.close)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Additional Monthly Summary Breakdown Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden backdrop-blur-md">
        <div className="border-b border-white/10 px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Monthly Breakdown
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Summary of all recorded financial months
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {tableData.length} {tableData.length === 1 ? 'month' : 'months'}
          </span>
        </div>

        {tableData.length === 0 ? (
          <div className="p-8 text-center text-xs sm:text-sm text-zinc-500">
            No monthly data to display yet.
          </div>
        ) : (
          <>
            {/* Mobile View (< 640px): Compact, Overflow-free Card Rows */}
            <div className="block sm:hidden divide-y divide-white/5">
              {paginatedTableData.map((s) => (
                <div key={s.monthKey} className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">
                      {s.monthLabel}
                    </span>
                    <span
                      className={`text-xs font-semibold font-mono tabular-nums ${
                        s.net >= 0 ? 'text-cyan-400' : 'text-amber-400'
                      }`}
                    >
                      {s.net >= 0 ? '+' : ''}
                      {formatINR(s.net)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-zinc-400">
                    <span className="text-emerald-400">
                      Income: {formatINR(s.income)}
                    </span>
                    <span className="text-rose-400">
                      Expenses: {formatINR(s.expenses)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View (>= 640px): Classic Clean Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/5 bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Month & Year
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Total Income
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Total Expenses
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Net Cashflow
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {paginatedTableData.map((s) => (
                    <tr
                      key={s.monthKey}
                      className="hover:bg-white/[0.02] transition"
                    >
                      <td className="px-5 py-3.5 font-sans font-medium text-foreground whitespace-nowrap">
                        {s.monthLabel}
                      </td>
                      <td className="px-5 py-3.5 text-right text-emerald-400 whitespace-nowrap">
                        {formatINR(s.income)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-rose-400 whitespace-nowrap">
                        {formatINR(s.expenses)}
                      </td>
                      <td
                        className={`px-5 py-3.5 text-right font-semibold whitespace-nowrap ${
                          s.net >= 0 ? 'text-cyan-400' : 'text-amber-400'
                        }`}
                      >
                        {s.net >= 0 ? '+' : ''}
                        {formatINR(s.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            <div className="flex flex-col min-[420px]:flex-row items-center justify-between gap-2.5 border-t border-white/10 px-4 sm:px-5 py-3 text-xs text-zinc-400 bg-white/[0.01]">
              <div className="font-mono text-[11px] sm:text-xs">
                Showing{' '}
                <span className="text-zinc-200 font-semibold">
                  {breakdownStartIndex + 1}–{breakdownEndIndex}
                </span>{' '}
                of{' '}
                <span className="text-zinc-200 font-semibold">
                  {tableData.length}
                </span>{' '}
                {tableData.length === 1 ? 'month' : 'months'}
              </div>

              <div className="flex items-center justify-between min-[420px]:justify-end gap-3 w-full min-[420px]:w-auto">
                <span className="text-[11px] sm:text-xs font-mono text-zinc-500">
                  Page {safeBreakdownPage} of {totalBreakdownPages}
                </span>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBreakdownPage((p) => Math.max(1, p - 1))}
                    disabled={safeBreakdownPage <= 1}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBreakdownPage((p) => Math.min(totalBreakdownPages, p + 1))}
                    disabled={safeBreakdownPage >= totalBreakdownPages}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground text-zinc-300 disabled:opacity-30 disabled:pointer-events-none transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                    aria-label="Next page"
                    title="Next page"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
