# Project Stability and Security Audit Report

**Project**: `my-portfolio` (https://sijomonps.github.io/)  
**Audit Target**: Complete Codebase & Personal Finance Dashboard (`/f`)  
**Audit Date**: October 15, 2026  
**Environment**: Next.js 16.2.2 (App Router, Static Export), React 19.2.4, TypeScript 5.7.2, Tailwind CSS 3.4.17, Supabase JS 2.117.3, GitHub Pages  
**Auditor**: Antigravity Autonomous Security & Stability Auditor  

---

## 1. Executive Summary

A comprehensive stability, security, architectural, and calculation audit was conducted across the entire repository with particular focus on the `/f` private finance management system.

The core architecture is solid:
- The project successfully compiles with TypeScript (`npx tsc --noEmit` passed with 0 errors).
- ESLint passed with 0 errors and 3 minor warnings in pre-existing portfolio files.
- The Next.js static build (`output: "export"`) executes smoothly and prerenders the static `/f` route to `out/f/index.html`.
- Supabase Row Level Security (RLS) is well-designed with ownership checks (`auth.uid() = user_id`) on all operations.
- The user interface is responsive down to 320px viewport widths, featuring deterministic pagination clamping and non-jumping Indian currency inputs.

However, the audit identified **3 High-Severity**, **4 Medium-Severity**, **4 Low-Severity**, and **3 Informational** findings that require attention to guarantee production stability, avoid runtime routing 404s, and prevent silent financial visualization bugs:
1. **Live GitHub Pages 404 on `/f/`**: On the live deployment, requests to `https://sijomonps.github.io/f/` return HTTP 404 because `trailingSlash: true` was conditionally tied to `process.env.NODE_ENV === "production"`, but `NODE_ENV` is not exported in the GitHub Actions workflow environment during Next.js configuration evaluation.
2. **Candlestick Chart 'ALL' Range Drops Future-Dated Transactions**: In `calculateCandlestickData`, when fewer than 6 months of data exist, the fallback replaces the range with `getRecentMonthKeys(6)`, which only spans historical months up to the current calendar month. Any future-dated transactions (e.g., scheduled invoices or upcoming income) are dropped from the chart.
3. **Supabase Update RLS Policy Migration Required**: The transaction edit functionality requires executing `supabase/add-update-policy.sql` in the Supabase SQL Editor; otherwise, live edit operations are rejected by Supabase RLS.
4. **Single-User Email Guard Missing on Client Session**: Any authenticated Supabase user could technically load the `/f` UI (though RLS isolates their database rows). An explicit email validation guard should be added in `app/f/page.tsx`, and public signups should be disabled in the Supabase Dashboard.
5. **Absence of Automated Tests and Error Boundaries**: No unit, integration, or E2E tests exist, and no `app/f/error.tsx` boundary is defined to gracefully catch uncaught component rendering exceptions.

---

## 2. Overall Stability Assessment

| Dimension | Rating | Status & Evidence |
| :--- | :--- | :--- |
| **Build & Type Safety** | **High** | `tsc --noEmit` passed with 0 errors. Next.js static export generates `out/` cleanly. Zero `: any` or `as any` found in application code. |
| **Authentication & RLS** | **High** | Multi-layer security: client-side session gate + PostgreSQL Row Level Security enforcing `auth.uid() = user_id` on SELECT, INSERT, UPDATE, DELETE. Anon users have zero privileges. |
| **Financial Calculations** | **Medium-High** | Available balance, monthly income, expenses, and total earned are computed from complete dataset. Candlestick running balance accurately models opening/closing/high/low, but drops future-dated transactions in ALL range fallback. |
| **Deployment & Routing** | **Medium** | Static export succeeds locally, but live GitHub Pages site currently serves 404 on `https://sijomonps.github.io/f/` due to trailing slash config evaluation in CI. |
| **Responsive UI & Forms** | **High** | Mobile reflow handles viewports from 320px to 1440px without page overflow. Input cursor position tracking functions reliably across Indian number formatting. |
| **Resilience & Testing** | **Low-Medium** | Zero automated tests in repo. No Next.js React Error Boundary defined in `app/f/`. |

---

## 3. Audit Scope and Limitations

### In Scope
- All application source files in `app/`, `lib/`, `supabase/`, and root configurations (`next.config.ts`, `.github/workflows/deploy.yml`, `package.json`, `tsconfig.json`).
- Live production HTTP inspection of `https://sijomonps.github.io/` and `https://sijomonps.github.io/f/` using HTTP header analysis.
- Dependency supply-chain vulnerability audit via `npm audit`.
- TypeScript compiler verification via `npx tsc --noEmit`.
- Code quality and linting verification via `npm run lint`.
- Static site production build and artifact verification via `npm run build`.
- Local execution of calculation test cases using isolated Node test harnesses.

### Limitations & Out of Scope
- **Live Supabase Database Access**: Direct SQL connection to the user's remote Supabase PostgreSQL instance was not available. Policy inspection was performed on `supabase/finance-schema.sql` and `supabase/add-update-policy.sql`.
- **Destructive Testing**: In accordance with audit rules, no real transactions were inserted, updated, or deleted, and no remote database resets were performed.
- **Secret Credentials**: No private environment variables or auth tokens were accessed or exposed.

---

## 4. Build, Lint, Type-Check, and Automated Test Results

### 4.1. TypeScript Compilation (`npx tsc --noEmit`)
- **Exit Code**: `0`
- **Errors**: `0`
- **Assessment**: Strict type checking passed cleanly across the entire codebase.

### 4.2. ESLint (`npm run lint`)
- **Exit Code**: `0`
- **Errors**: `0`
- **Warnings**: `3`
  1. `app/components/sections/MySkills.tsx:13:3`: `'SiPython' is defined but never used` (`@typescript-eslint/no-unused-vars`)
  2. `app/components/sections/MySkills.tsx:31:10`: `'MdDevices' is defined but never used` (`@typescript-eslint/no-unused-vars`)
  3. `postcss.config.mjs:1:1`: `Assign object to a variable before exporting as module default` (`import/no-anonymous-default-export`)
- **Assessment**: No lint errors in the finance dashboard or core application. The 3 warnings are non-breaking stylistic items in portfolio sections.

### 4.3. Production Build & Static Export (`npm run build`)
- **Exit Code**: `0`
- **Duration**: ~3.9s - 6.7s
- **Output Artifacts**: Verified in `./out`:
  - `out/index.html` (208 KB)
  - `out/f/index.html` (18 KB)
  - `out/404.html` (18 KB)
  - `out/robots.txt`
  - `out/sitemap.xml`
- **Assessment**: Static export succeeds without server-side dependencies.

### 4.4. Dependency Audit (`npm audit`)
- **Exit Code**: `1`
- **Vulnerabilities**: 23 total (1 critical, 17 high, 4 moderate, 1 low)
- **Breakdown**:
  - `next` (9.3.4-canary.0 - 16.3.7): 1 Critical, multiple High advisories related to Server Actions, Image Optimization API, and Middleware cache poisoning.
  - `sharp` (<=0.35.5-rc.1): High advisories in inherited `libvips`/`libheif`/`librsvg`.
  - `postcss` (<=8.5.22): High advisories regarding CSS stringify source maps.
  - `source-map-js`, `minimatch`, `nanoid`, `yaml`: Moderate to High advisories.
- **Assessment**: Because the application is deployed as a 100% static export (`output: "export"`) on GitHub Pages without a Node.js SSR runtime, server-side SSR/Middleware vulnerabilities cannot be exploited in production. However, developer environments and dependency hygiene warrant a measured update.

### 4.5. Automated Tests
- **Status**: No test runner or test suites exist in the repository.

---

## 5. Critical and High-Severity Findings

### [Finding-01] HIGH: Candlestick Chart 'ALL' Range Drops Future-Dated Transactions
- **ID**: `F-01`
- **Severity**: **High**
- **Category**: Financial Calculation / Chart Logic
- **Affected File**: [`lib/financeUtils.ts`](file:///home/sijomonps/Code/sijomonps.github.io/lib/financeUtils.ts#L293-L306) (`calculateCandlestickData`)
- **Status**: **Confirmed** (Verified via test script)
- **Evidence**:
  In `lib/financeUtils.ts`, when `range === 'ALL'`:
  ```typescript
  const earliestMonthKey = sorted[0].transaction_date.slice(0, 7);
  const lastTxMonthKey = sorted[sorted.length - 1].transaction_date.slice(0, 7);
  const latestMonthKey = currentMonthKey >= lastTxMonthKey ? currentMonthKey : lastTxMonthKey;

  if (earliestMonthKey > latestMonthKey) {
    monthKeys = [currentMonthKey];
  } else {
    monthKeys = getMonthsBetween(earliestMonthKey, latestMonthKey);
    if (monthKeys.length < 6) {
      monthKeys = getRecentMonthKeys(6); // <-- BUG
    }
  }
  ```
  If an upcoming transaction is logged for next month (e.g. `2026-11` when current month is `2026-10`), `getMonthsBetween` returns `['2026-11']`. Because its length is 1 (< 6), `monthKeys` is overwritten with `getRecentMonthKeys(6)`, which generates `['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']`.
  `2026-11` is completely omitted from `monthKeys`.
- **Impact**: Any future-dated transaction disappears from the candlestick chart in ALL ranges (6M, 1Y, and ALL). Furthermore, because its date is after `monthKeys[0]`, it is neither added to the initial `runningBalance` nor processed in `txsByMonth`, producing an inaccurate balance graph.
- **Steps to Reproduce**:
  1. Add a transaction with `transaction_date: "2026-11-01"`.
  2. Switch to Summary tab with range "ALL".
  3. The chart displays only months up to October 2026; November is missing.
- **Recommended Solution**:
  When `monthKeys.length < 6` in `ALL` mode, prepend earlier historical months to pad the timeline up to 6 months while retaining `latestMonthKey`, rather than resetting to `getRecentMonthKeys(6)`.

---

### [Finding-02] HIGH: Live GitHub Pages Serves 404 on `/f/` with Trailing Slash
- **ID**: `F-02`
- **Severity**: **High**
- **Category**: Deployment / Routing
- **Affected File**: [`next.config.ts`](file:///home/sijomonps/Code/sijomonps.github.io/next.config.ts#L10-L14) & [`.github/workflows/deploy.yml`](file:///home/sijomonps/Code/sijomonps.github.io/.github/workflows/deploy.yml#L60-L65)
- **Status**: **Confirmed** (Verified against live production URL)
- **Evidence**:
  Running live HTTP requests against the deployed website:
  - `curl -sI https://sijomonps.github.io/f` returned `HTTP/2 200 OK` (Content-Type: `text/html`, serving `f.html`)
  - `curl -sI https://sijomonps.github.io/f/` returned `HTTP/2 404 Not Found` (Serving standard GitHub Pages 404)
  - `curl -sI https://sijomonps.github.io/f.html` returned `HTTP/2 200 OK`
- **Root Cause**:
  In `next.config.ts`:
  ```typescript
  const isProd = process.env.NODE_ENV === "production";
  const nextConfig: NextConfig = {
    output: "export",
    ...(isProd ? { trailingSlash: true } : {}),
  };
  ```
  In `.github/workflows/deploy.yml`:
  ```yaml
  - name: Build with Next.js
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY }}
      NEXT_PUBLIC_FINANCE_LOGIN_EMAIL: ${{ vars.NEXT_PUBLIC_FINANCE_LOGIN_EMAIL }}
    run: ${{ steps.detect-package-manager.outputs.runner }} next build
  ```
  `NODE_ENV` is not defined in the runner environment when `next.config.ts` is initially evaluated by Node.js. As a result, `isProd` was `false`, `trailingSlash` was not applied, and Next.js emitted `f.html` instead of `f/index.html`.
  GitHub Pages requires `f/index.html` to resolve directory URLs like `https://sijomonps.github.io/f/`.
- **Impact**: Any user or bookmark navigating to `https://sijomonps.github.io/f/` (with trailing slash) encounters a broken 404 page.
- **Recommended Solution**:
  1. Set `trailingSlash: true` unconditionally in `next.config.ts`.
  2. Add `NODE_ENV: production` to the `env` block of the `Build with Next.js` step in `.github/workflows/deploy.yml`.

---

### [Finding-03] HIGH: Supabase Update RLS Policy Migration Must Be Applied to Live Database
- **ID**: `F-03`
- **Severity**: **High**
- **Category**: Security / Database Permissions
- **Affected File**: [`supabase/add-update-policy.sql`](file:///home/sijomonps/Code/sijomonps.github.io/supabase/add-update-policy.sql)
- **Status**: **Confirmed** (Code & SQL Inspection)
- **Evidence**:
  The base schema in [`supabase/finance-schema.sql`](file:///home/sijomonps/Code/sijomonps.github.io/supabase/finance-schema.sql#L58-L60) originally granted:
  ```sql
  GRANT SELECT, INSERT, DELETE ON public.transactions TO authenticated;
  ```
  The edit feature added in [`EditTransactionModal.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/EditTransactionModal.tsx#L86-L96) executes an `UPDATE` query:
  ```typescript
  await supabase.from('transactions').update({ type, title, amount, transaction_date }).eq('id', transaction.id);
  ```
  If the live Supabase instance was created using the initial schema, Supabase RLS will block update requests with a 403 / permission error.
- **Impact**: Users attempting to edit transactions in the UI will receive `Failed to update transaction: permission denied for table transactions`.
- **Recommended Solution**:
  Execute `supabase/add-update-policy.sql` in the **Supabase Dashboard SQL Editor**:
  ```sql
  DROP POLICY IF EXISTS "Authenticated users can update their own transactions" ON public.transactions;
  CREATE POLICY "Authenticated users can update their own transactions"
  ON public.transactions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  GRANT UPDATE (type, title, amount, transaction_date) ON public.transactions TO authenticated;
  ```

---

## 6. Medium and Low-Severity Findings

### [Finding-04] MEDIUM: Client-Side Session Does Not Enforce Single-User Email Matching
- **ID**: `F-04`
- **Severity**: **Medium**
- **Category**: Authentication & Account Security
- **Affected File**: [`app/f/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/page.tsx#L93-L99) & [`PasswordScreen.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/PasswordScreen.tsx#L34-L37)
- **Status**: **Confirmed**
- **Evidence**:
  `PasswordScreen` authenticates with `financeLoginEmail`:
  ```typescript
  await supabase.auth.signInWithPassword({ email: financeLoginEmail, password });
  ```
  However, in `app/f/page.tsx`:
  ```typescript
  useEffect(() => {
    if (session) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [session, fetchTransactions]);
  ```
  If public registration is enabled in Supabase Auth, any third party could call `supabase.auth.signUp()` with a different email, sign in, and have their token stored in `localStorage`. While Supabase RLS prevents them from seeing the owner's transactions, `page.tsx` will grant access to the dashboard UI under their account.
- **Impact**: Unintended accounts can access the dashboard interface and insert transactions into the database.
- **Recommended Solution**:
  1. Add an email verification check in `app/f/page.tsx`:
     ```typescript
     if (session && financeLoginEmail && session.user?.email?.toLowerCase() !== financeLoginEmail.toLowerCase()) {
       await supabase.auth.signOut();
       setSession(null);
     }
     ```
  2. Disable "Enable Email Signup" in the Supabase Dashboard under Authentication -> Providers -> Email.

---

### [Finding-05] MEDIUM: Zero Automated Tests in Repository
- **ID**: `F-05`
- **Severity**: **Medium**
- **Category**: Quality Assurance & Regression Prevention
- **Affected File**: [`package.json`](file:///home/sijomonps/Code/sijomonps.github.io/package.json)
- **Status**: **Confirmed**
- **Evidence**:
  There are no test configuration files (`vitest.config.ts`, `jest.config.js`) and no test files (`*.test.ts`, `*.spec.ts`) anywhere in the repository.
- **Impact**: Future modifications to formatting (`formatIndianNumberString`), calculations (`calculateMetrics`, `calculateCandlestickData`), or pagination boundaries could introduce regressions undetected.
- **Recommended Solution**:
  Add `vitest` as a devDependency and create unit test suites for `lib/financeUtils.ts`.

---

### [Finding-06] MEDIUM: Missing React Error Boundary in Finance Route
- **ID**: `F-06`
- **Severity**: **Medium**
- **Category**: Resilience & Architecture
- **Affected File**: `app/f/`
- **Status**: **Confirmed**
- **Evidence**:
  No `app/f/error.tsx` or `app/error.tsx` exists in the Next.js App Router directory.
- **Impact**: If an unexpected runtime exception occurs in any child component (e.g. malformed transaction data or unexpected browser locale behavior), React 19 unmounts the entire page tree, leaving the user with an unresponsive blank screen.
- **Recommended Solution**:
  Create [`app/f/error.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/error.tsx) with a clean fallback card and a "Retry" button.

---

### [Finding-07] MEDIUM: Dependency Vulnerabilities in Next.js & Sub-packages
- **ID**: `F-07`
- **Severity**: **Medium**
- **Category**: Supply Chain & Dependencies
- **Affected File**: [`package.json`](file:///home/sijomonps/Code/sijomonps.github.io/package.json#L17) & [`package-lock.json`](file:///home/sijomonps/Code/sijomonps.github.io/package-lock.json)
- **Status**: **Confirmed** (Verified via `npm audit`)
- **Evidence**:
  `npm audit` reports 23 vulnerabilities in transitive packages:
  - `next`: Advisories GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj, GHSA-26hh-7cqf-hhc6, etc.
  - `sharp`, `postcss`, `source-map-js`, `minimatch`, `nanoid`, `yaml`.
- **Impact**: Mitigated in production due to static export on GitHub Pages (no Node server or SSR runtime). However, local dev servers (`next dev`) and build pipelines remain exposed.
- **Recommended Solution**:
  Update `next` to the latest stable patch version once verified with static export.

---

### [Finding-08] LOW: Backspace Cursor Positioning Discrepancy Across Multiple Comma Groups in `AmountInput`
- **ID**: `F-08`
- **Severity**: **Low**
- **Category**: Money Formatting & Usability
- **Affected File**: [`app/f/components/AmountInput.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/AmountInput.tsx#L82) (`handleKeyDown`)
- **Status**: **Confirmed** (Verified via Node script)
- **Evidence**:
  In `handleKeyDown`:
  ```typescript
  const target = selectionStart - 2;
  for (let i = 0; i < updated.length; i++) {
    if (count === target) {
      newPos = i;
      break;
    }
    if (updated[i] !== ',') count++;
    newPos = i + 1;
  }
  ```
  `target` is calculated from the raw string index `selectionStart - 2`. If `value` already contains commas prior to that index (e.g., `"1,00,|000"` where comma is at index 1 and index 4), `target = 3` represents string index 3 rather than the count of 2 non-comma digits. This shifts the cursor by 1 position (`"10,0|00"` instead of `"10,|000"`).
- **Impact**: Minor cursor jump when backspacing immediately to the right of the second or third comma in numbers above ₹1,00,000.
- **Recommended Solution**:
  Compute `target` by counting non-comma characters before `selectionStart - 2`, exactly as done in `handleChange`.

---

### [Finding-09] LOW: Negative Balance Currency Formatting in Candlestick Chart Y-Axis
- **ID**: `F-09`
- **Severity**: **Low**
- **Category**: UI / Formatting
- **Affected File**: [`app/f/components/SummaryView.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/SummaryView.tsx#L313)
- **Status**: **Confirmed**
- **Evidence**:
  Line 313 renders:
  ```tsx
  <text ...>₹{formatCompactINR(val)}</text>
  ```
  For negative balances, `formatCompactINR(-500)` returns `"-500"`. Concatenating with `₹` results in `₹-500` instead of standard financial formatting `-₹500`.
- **Impact**: Minor typographical inconsistency if account balance goes negative.
- **Recommended Solution**:
  Format as `{val < 0 ? `-₹${formatCompactINR(Math.abs(val))}` : `₹${formatCompactINR(val)}`}`.

---

### [Finding-10] LOW: Missing Disallow Rule in `robots.ts` for `/f/` Route
- **ID**: `F-10`
- **Severity**: **Low**
- **Category**: SEO & Privacy
- **Affected File**: [`app/robots.ts`](file:///home/sijomonps/Code/sijomonps.github.io/app/robots.ts#L7-L10)
- **Status**: **Confirmed**
- **Evidence**:
  `app/robots.ts` specifies:
  ```typescript
  rules: { userAgent: '*', allow: '/' }
  ```
  While `app/f/layout.tsx` emits `<meta name="robots" content="noindex, nofollow" />`, search engine crawlers that consult `robots.txt` are permitted to crawl `/f/`.
- **Impact**: Search crawlers may fetch the private `/f/` page and its assets.
- **Recommended Solution**:
  Add `disallow: '/f/'` to `app/robots.ts`.

---

### [Finding-11] LOW: Missing Maximum Length & Numerical Cap on Transaction Input
- **ID**: `F-11`
- **Severity**: **Low**
- **Category**: Input Validation & Database Robustness
- **Affected File**: [`app/f/components/TransactionModal.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/TransactionModal.tsx#L62-L70) & [`EditTransactionModal.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/components/EditTransactionModal.tsx#L67-L72)
- **Status**: **Confirmed**
- **Evidence**:
  Title input has no `maxLength` attribute. Amount input has no upper bound check. The database schema specifies `amount NUMERIC(14, 2)`. If a user enters or pastes an amount exceeding 12 integer digits (e.g. ₹1,00,00,00,00,000), Supabase PostgreSQL will throw a `numeric field overflow` error.
- **Impact**: Unhandled database error if extreme values or paste errors occur.
- **Recommended Solution**:
  Add `maxLength={100}` on title inputs and validate `numericAmount <= 9999999999.99` (₹10,000 Crore limit).

---

### [Finding-12] INFORMATIONAL: Unused Orphaned Fonts in `app/fonts/`
- **ID**: `F-12`
- **Severity**: **Informational**
- **Category**: Repository Hygiene
- **Affected File**: `app/fonts/GeistMonoVF.woff` (67 KB) & `app/fonts/GeistVF.woff` (65 KB)
- **Status**: **Confirmed**
- **Evidence**:
  Fonts are imported from Google Fonts via `next/font/google` in `app/layout.tsx`. The local `.woff` files in `app/fonts/` are unused starter files.
- **Impact**: 132 KB of redundant files stored in git.
- **Recommended Solution**:
  Delete `app/fonts/GeistMonoVF.woff` and `app/fonts/GeistVF.woff`.

---

### [Finding-13] INFORMATIONAL: Full In-Memory Fetch of Transactions
- **ID**: `F-13`
- **Severity**: **Informational**
- **Category**: Performance & Scalability
- **Affected File**: [`app/f/page.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/f/page.tsx#L74-L78)
- **Status**: **Confirmed**
- **Evidence**:
  `supabase.from('transactions').select('*')` retrieves all transactions in one query without a row limit.
- **Impact**: Completely adequate for personal finance with hundreds of transactions, but will grow linearly in payload size if records reach tens of thousands.
- **Recommended Solution**:
  Document scalability limits; consider adding year-range filters if transaction history exceeds 5,000 records.

---

### [Finding-14] INFORMATIONAL: ESLint Warnings in Portfolio Components
- **ID**: `F-14`
- **Severity**: **Informational**
- **Category**: Code Quality
- **Affected File**: [`app/components/sections/MySkills.tsx`](file:///home/sijomonps/Code/sijomonps.github.io/app/components/sections/MySkills.tsx#L13) & [`postcss.config.mjs`](file:///home/sijomonps/Code/sijomonps.github.io/postcss.config.mjs#L1)
- **Status**: **Confirmed** (Verified via `npm run lint`)
- **Evidence**:
  Unused icon imports `SiPython` and `MdDevices` in `MySkills.tsx`, and anonymous export in `postcss.config.mjs`.
- **Recommended Solution**:
  Remove unused imports and assign postcss configuration to a named constant before exporting.

---

## 7. Security and Supabase Findings Summary

| Security Layer | Implementation Status | Risk Evaluation |
| :--- | :--- | :--- |
| **Row Level Security (RLS)** | Enabled on `public.transactions` | **Robust**: `auth.uid() = user_id` enforced on SELECT, INSERT, UPDATE, DELETE. |
| **Anonymous Access** | `REVOKE ALL FROM anon, public` | **Secure**: Anon users cannot view or manipulate data even if calling API directly. |
| **Key Exposure** | Only public anon key used in frontend | **Secure**: No service-role key or secret token exists in client bundles or git history. |
| **Database Constraints** | `CHECK (amount > 0)`, `CHECK (type IN ('income', 'expense'))` | **Robust**: Database level integrity prevents negative values or invalid types. |
| **Database Permissions** | `GRANT UPDATE (type, title, amount, transaction_date)` | **Secure**: Column level grant prevents modifying `user_id` or `id`. *Requires running `add-update-policy.sql` on live DB.* |
| **Public Email Guard** | Frontend uses `NEXT_PUBLIC_FINANCE_LOGIN_EMAIL` | **Action Needed**: Enforce email check in `page.tsx` and disable open signups in Supabase Auth. |

---

## 8. Financial Calculation and Data Integrity Findings Summary

| Calculation | Logic & Implementation | Status |
| :--- | :--- | :--- |
| **Available Balance** | `totalEarned - allTimeExpenses` computed across complete dataset. | Verified Correct |
| **Income This Month** | `tYear === currentYear && tMonth === currentMonth` where `type === 'income'`. | Verified Correct |
| **Expenses This Month** | `tYear === currentYear && tMonth === currentMonth` where `type === 'expense'`. | Verified Correct |
| **Total Earned** | Cumulative sum of all income transactions. | Verified Correct |
| **Monthly Table Summary** | Groups by `YYYY-MM` in descending order, calculates income, expenses, net. | Verified Correct |
| **Candlestick OHLC** | Tracks running cumulative balance across time; correctly calculates open, high, low, close. | Bug in ALL range fallback when future transactions exist (F-01). |
| **Floating-Point Precision** | Numbers stored as float; UI formats via `Intl.NumberFormat('en-IN')`. | Functional; rounding to 2 decimal places recommended for edge additions. |

---

## 9. UI, Responsiveness, Accessibility, and Performance Findings Summary

- **Responsiveness**:
  - 320px: Metric cards stack into 1 column, action buttons remain balanced side-by-side, pagination stacks cleanly.
  - 360px - 767px: Metric cards reflow into compact 2-column grid.
  - 768px - 1023px: Tablet navbar displays tabs inline.
  - 1024px+: 4-column metric grid.
- **Accessibility**:
  - Semantic `<button>`, `<input>`, and `<header>` tags used.
  - Form inputs feature corresponding `<label>` tags with matching `htmlFor`/`id`.
  - Icon-only buttons include `aria-label` and `title` attributes.
  - Modals support closing via `Escape` key and clicking outside backdrop. Focus trapping should be added in future enhancements.
- **Performance**:
  - Zero heavy third-party chart dependencies (candlestick chart is lightweight native SVG).
  - React state uses `useMemo` for derived metric calculations.
  - No memory leaks or uncleaned event listeners detected.

---

## 10. GitHub Pages Deployment Findings Summary

- **Static Export**: Next.js App Router static export (`output: "export"`) executes properly with `npm run build`.
- **Routing**:
  - Live site currently serves `https://sijomonps.github.io/f` (HTTP 200).
  - Live site returns 404 for `https://sijomonps.github.io/f/` due to conditional `trailingSlash` evaluation.
- **CI/CD Workflow**:
  - `.github/workflows/deploy.yml` correctly targets GitHub Pages using `@actions/deploy-pages@v4`.
  - Workflow must explicitly export `NODE_ENV: production` in the build step.
  - Repository variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_FINANCE_LOGIN_EMAIL` must be set under GitHub **Repository Variables** (not Secrets) to match `vars.*` syntax.

---

## 11. Missing Tests and Recommended Testing Strategy

The repository currently lacks automated testing. The following test suites are strongly recommended:

1. **Unit Tests (`lib/financeUtils.test.ts`)**:
   - `calculateMetrics`: Test with mixed income/expenses, empty arrays, single-item arrays, cross-year boundaries.
   - `calculateCandlestickData`: Test with continuous months, gap months, negative balances, and future dates.
   - `formatIndianNumberString`: Test grouping at `1,000`, `10,000`, `1,00,000`, `10,00,000`, decimal inputs, leading zeros, and trailing dots.
   - `parseFormattedAmount`: Verify accurate float conversion and comma removal.
2. **Pagination Logic Tests**:
   - Verify boundary clamping with 0 items, 1 item, exact page limits (10 items), and deletion of the last item on the active page.
3. **Component Smoke Tests**:
   - Verify that `PasswordScreen` renders when `session` is null.
   - Verify that `DashboardView` renders correctly when `session` is valid.

---

## 12. Prioritised Remediation Plan

### Phase 1: High-Priority Fixes (Immediate)
1. **Fix GitHub Pages Routing**:
   - In `next.config.ts`, set `trailingSlash: true` unconditionally.
   - In `.github/workflows/deploy.yml`, add `NODE_ENV: production` to the build step environment.
2. **Fix Candlestick 'ALL' Range Fallback**:
   - In `lib/financeUtils.ts`, update `calculateCandlestickData` to pad historical months rather than replacing `monthKeys` with `getRecentMonthKeys(6)`.
3. **Execute Supabase Update Policy**:
   - Execute `supabase/add-update-policy.sql` in the Supabase SQL Editor.

### Phase 2: Medium-Priority Enhancements
4. **Client-Side Email Guard**:
   - In `app/f/page.tsx`, check `session.user.email` against `financeLoginEmail`.
   - Disable user signups in Supabase Auth settings.
5. **Add React Error Boundary**:
   - Create `app/f/error.tsx`.
6. **Setup Automated Unit Testing**:
   - Add `vitest` and implement test suites for `lib/financeUtils.ts`.

### Phase 3: Low-Priority & Informational Polish
7. **Fix AmountInput Backspace Cursor Offset**:
   - Adjust `target` computation in `AmountInput.tsx` `handleKeyDown`.
8. **Refine Negative Currency Label**:
   - Format negative Y-axis chart labels as `-₹500` instead of `₹-500`.
9. **Update `robots.ts`**:
   - Add `disallow: '/f/'`.
10. **Clean Up Unused Files**:
    - Remove orphaned `app/fonts/*.woff` files.
    - Fix ESLint warnings in `MySkills.tsx` and `postcss.config.mjs`.

---

## 13. Manual Actions Required by Repository Owner

1. **Supabase SQL Editor**:
   - Open your project at [supabase.com](https://supabase.com).
   - Go to the **SQL Editor**.
   - Paste and execute the contents of [`supabase/add-update-policy.sql`](file:///home/sijomonps/Code/sijomonps.github.io/supabase/add-update-policy.sql):
     ```sql
     DROP POLICY IF EXISTS "Authenticated users can update their own transactions" ON public.transactions;
     CREATE POLICY "Authenticated users can update their own transactions"
     ON public.transactions FOR UPDATE TO authenticated
     USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
     GRANT UPDATE (type, title, amount, transaction_date) ON public.transactions TO authenticated;
     ```
2. **Supabase Auth Settings**:
   - In the Supabase Dashboard, navigate to **Authentication -> Providers -> Email**.
   - Ensure **"Allow new users to sign up"** is **Disabled** (unchecked) to prevent third-party accounts from registering.
3. **GitHub Repository Settings**:
   - In GitHub repository settings (`Settings -> Secrets and variables -> Actions -> Variables`), verify that the following are present under **Repository Variables**:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `NEXT_PUBLIC_FINANCE_LOGIN_EMAIL`

---

## 14. Verification Checklist (To Run After Fixes)

- [ ] Run `npx tsc --noEmit` and confirm 0 errors.
- [ ] Run `npm run lint` and confirm 0 errors.
- [ ] Run `npm run build` and verify `out/f/index.html` is generated.
- [ ] Run automated tests once installed (`npm test`).
- [ ] Commit and push to `main` branch to trigger GitHub Actions.
- [ ] Test live production URLs:
  - `curl -sI https://sijomonps.github.io/f/` -> must return `HTTP/2 200`.
  - `curl -sI https://sijomonps.github.io/f` -> must redirect or return `HTTP/2 200`.
- [ ] Log in at `https://sijomonps.github.io/f/`, add a test transaction, edit it, verify the edit updates in the table and chart, and delete it.
