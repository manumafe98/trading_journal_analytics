'use client';

import { useState } from 'react';
import {
  LayoutDashboardIcon,
  CreditCardIcon,
  ArrowUpRightIcon,
  SettingsIcon,
  HelpCircleIcon,
  UsersIcon,
  SearchIcon,
  ChevronDownIcon,
  UploadIcon,
  DownloadIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MenuIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceView, setBalanceView] = useState<'weekly' | 'monthly'>(
    'weekly',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock transaction data
  const transactions = [
    {
      id: 'PAY-001',
      amount: 1250.0,
      to: 'Acme Corp',
      period: 'Jan 1 - Jan 31',
      method: 'Credit Card',
      date: 'Jan 31, 2024',
      status: 'received' as const,
    },
    {
      id: 'PAY-002',
      amount: 890.5,
      to: 'Tech Solutions',
      period: 'Feb 1 - Feb 28',
      method: 'Bank Transfer',
      date: 'Feb 28, 2024',
      status: 'processed' as const,
    },
    {
      id: 'PAY-003',
      amount: 2100.0,
      to: 'Global Services',
      period: 'Mar 1 - Mar 31',
      method: 'Credit Card',
      date: 'Mar 31, 2024',
      status: 'received' as const,
    },
    {
      id: 'PAY-004',
      amount: 450.75,
      to: 'Local Vendor',
      period: 'Apr 1 - Apr 30',
      method: 'PayPal',
      date: 'Apr 15, 2024',
      status: 'failed' as const,
    },
    {
      id: 'PAY-005',
      amount: 3200.0,
      to: 'Enterprise Inc',
      period: 'May 1 - May 31',
      method: 'Wire Transfer',
      date: 'May 30, 2024',
      status: 'processed' as const,
    },
    {
      id: 'PAY-006',
      amount: 675.25,
      to: 'Startup Labs',
      period: 'Jun 1 - Jun 30',
      method: 'Credit Card',
      date: 'Jun 28, 2024',
      status: 'received' as const,
    },
    {
      id: 'PAY-007',
      amount: 1820.0,
      to: 'Digital Agency',
      period: 'Jul 1 - Jul 31',
      method: 'Bank Transfer',
      date: 'Jul 29, 2024',
      status: 'processed' as const,
    },
    {
      id: 'PAY-008',
      amount: 990.5,
      to: 'Cloud Services',
      period: 'Aug 1 - Aug 31',
      method: 'Credit Card',
      date: 'Aug 30, 2024',
      status: 'received' as const,
    },
  ];

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const chartData =
    balanceView === 'weekly'
      ? [
          { label: 'Mon', value: 2400 },
          { label: 'Tue', value: 1800 },
          { label: 'Wed', value: 3200 },
          { label: 'Thu', value: 4200 },
          { label: 'Fri', value: 3600 },
          { label: 'Sat', value: 2800 },
          { label: 'Sun', value: 2200 },
        ]
      : [
          { label: 'Jan', value: 12400 },
          { label: 'Feb', value: 15800 },
          { label: 'Mar', value: 18200 },
          { label: 'Apr', value: 21200 },
          { label: 'May', value: 19600 },
          { label: 'Jun', value: 17800 },
        ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 px-4 md:px-6 lg:px-8 transition-colors">
      {/* Outer Shell Container */}
      <div className="max-w-7xl mx-auto overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-64
              bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
              transform transition-all duration-300 lg:transform-none
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              flex flex-col p-4 lg:p-5
            `}
          >
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-semibold text-gray-950 dark:text-gray-950">
                M
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-gray-50">
                Mevolut
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6">
              {/* Main Section */}
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-2 px-2 tracking-wider">
                  Main
                </div>
                <div className="space-y-1">
                  <NavItem
                    icon={LayoutDashboardIcon}
                    label="Dashboard"
                    active
                  />
                  <NavItem icon={CreditCardIcon} label="Transactions" />
                  <NavItem icon={ArrowUpRightIcon} label="Transfers" />
                </div>
              </div>

              {/* Management Section */}
              <div>
                <div className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-2 px-2 tracking-wider">
                  Management
                </div>
                <div className="space-y-1">
                  <NavItem icon={UsersIcon} label="Team" />
                  <NavItem icon={SettingsIcon} label="Settings" />
                  <NavItem icon={HelpCircleIcon} label="Support" />
                </div>
              </div>
            </nav>

            {/* Upgrade Card */}
            <div
              className="mt-auto bg-gradient-to-br
            from-primary-100 via-primary-200 to-gray-300/30
            dark:from-primary-700 dark:via-primary-800 dark:to-gray-700/30 rounded-xl p-4"
            >
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Upgrade to Pro
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/70 mb-3">
                Unlock advanced features and unlimited transactions
              </p>
              <button className="w-full h-9 bg-gray-950 dark:bg-gray-950 text-white rounded-lg text-sm font-medium hover:bg-gray-900 dark:hover:bg-gray-900 transition-colors">
                Upgrade Now
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeSwitch />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <SummaryCard
                label="Total Balance"
                value="$24,582.50"
                delta="+12.5%"
                trending="up"
              />
              <SummaryCard
                label="Monthly Spending"
                value="$8,240.00"
                delta="-3.2%"
                trending="down"
              />
              <SummaryCard
                label="Pending Transfers"
                value="$1,450.00"
                delta="+5.8%"
                trending="up"
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
              {/* Spending Limits Card */}
              <div className="lg:col-span-5">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-xl h-full transition-colors">
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-50 mb-4">
                    AI-Generated Spending Limits
                  </h2>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        $4,285
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        of $8,000
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: '53.5%' }}
                      />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <LegendItem
                      color="bg-primary-500"
                      label="Shopping"
                      value="$1,840"
                    />
                    <LegendItem
                      color="bg-cyan-400"
                      label="Subscriptions"
                      value="$680"
                    />
                    <LegendItem
                      color="bg-yellow-400"
                      label="Dining"
                      value="$945"
                    />
                    <LegendItem
                      color="bg-purple-400"
                      label="Other"
                      value="$820"
                    />
                  </div>

                  {/* Virtual Card */}
                  <div className="relative w-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-primary-500/20 rounded-xl p-4 overflow-hidden aspect-[16/9] max-w-96">
                    {/* VISA logo */}
                    <div className="text-gray-900 dark:text-white text-sm font-semibold mb-8">
                      VISA
                    </div>

                    {/* Card number */}
                    <div className="text-gray-900 dark:text-white text-base font-medium tracking-wider mb-2">
                      •••• •••• •••• 4582
                    </div>

                    {/* Card meta */}
                    <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-300">
                      <div>
                        <div className="text-gray-500 text-[10px]">
                          VALID THRU
                        </div>
                        <div>12/28</div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-300 text-[10px]">
                          CVV
                        </div>
                        <div>•••</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Chart Card */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-xl transition-colors h-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h2 className="text-base font-medium text-gray-900 dark:text-gray-50 mb-1">
                        Available Balance
                      </h2>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        $24,582.50
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="h-9 px-4 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Request
                      </button>
                      <button className="h-9 px-4 bg-primary-500 text-gray-950 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors">
                        Transfer
                      </button>
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="inline-flex items-center h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 mb-6">
                    <button
                      onClick={() => setBalanceView('weekly')}
                      className={`px-3 h-full rounded-full text-xs font-medium transition-colors ${
                        balanceView === 'weekly'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setBalanceView('monthly')}
                      className={`px-3 h-full rounded-full text-xs font-medium transition-colors ${
                        balanceView === 'monthly'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>

                  {/* Chart */}
                  <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
                    {chartData.map((item, index) => {
                      const isHighlight = index === 3;
                      const heightPercent = (item.value / maxValue) * 100;
                      return (
                        <div
                          key={item.label}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full flex items-end justify-center"
                            style={{ height: '200px' }}
                          >
                            <div
                              className={`w-full max-w-[28px] rounded-t-md transition-all ${
                                isHighlight
                                  ? 'bg-primary-500'
                                  : 'bg-gray-600/25'
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Toolbar */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 border border-gray-200 dark:border-gray-700/50 mb-4 flex flex-wrap items-center gap-3 transition-colors">
              <div className="flex-1 min-w-[200px] relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Transaction..."
                  className="w-full h-9 pl-9 pr-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button className="h-8 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-1">
                  Processed Date
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
                <button className="h-8 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-1">
                  More
                  <ChevronDownIcon className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="h-9 px-4 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <UploadIcon className="w-4 h-4" />
                  Import
                </button>
                <button className="h-9 px-4 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-xl overflow-hidden transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700/50">
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Payment ID
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Total Amount
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        To
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal hidden md:table-cell">
                        Payment Period
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal hidden lg:table-cell">
                        Payment Method
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Processed Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200/50 dark:border-gray-700/25 hover:bg-gray-50 dark:hover:bg-gray-700/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                          {transaction.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-right">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                          {transaction.to}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hidden md:table-cell">
                          {transaction.period}
                        </td>
                        <td className="px-4 py-3 text-sm hidden lg:table-cell">
                          <span className="inline-flex items-center h-8 px-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-xs">
                            {transaction.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={transaction.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-700/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, transactions.length)} of{' '}
                  {transactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Helper Components

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
        w-full flex items-center gap-3 h-9 px-3 text-sm font-medium
        transition-colors
        ${
          active
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 border-l-2 border-primary-500'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <div
        className={`
          w-4 h-4 flex items-center justify-center
          ${active ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}
        `}
      >
        <Icon className="w-4 h-4" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function SummaryCard({
  label,
  value,
  delta,
  trending,
}: {
  label: string;
  value: string;
  delta: string;
  trending: 'up' | 'down';
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-xl transition-colors">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
        {value}
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-xs ${
            trending === 'up'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {trending === 'up' ? (
            <TrendingUpIcon className="w-3 h-3" />
          ) : (
            <TrendingDownIcon className="w-3 h-3" />
          )}
          {delta}
        </span>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
          {label}
        </div>
        <div className="text-xs font-medium text-gray-900 dark:text-gray-50">
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: 'received' | 'processed' | 'failed';
}) {
  const styles = {
    received: {
      bg: 'bg-gray-100 dark:bg-gray-900',
      text: 'text-gray-900 dark:text-gray-300',
      icon: 'text-emerald-400',
    },
    processed: {
      bg: 'bg-gray-100 dark:bg-gray-900',
      text: 'text-gray-900 dark:text-gray-300',
      icon: 'text-cyan-400',
    },
    failed: {
      bg: 'bg-gray-100 dark:bg-gray-900',
      text: 'text-gray-900 dark:text-gray-300',
      icon: 'text-red-400',
    },
  };

  const style = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs ${style.bg} ${style.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.icon} bg-current`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
