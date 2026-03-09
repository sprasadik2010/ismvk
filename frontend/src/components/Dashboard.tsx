import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Home, Building2 } from 'lucide-react';
import { type DashboardData, type Department } from '../types';

interface Props {
  data: DashboardData;
  selectedDepartment: Department; // Add selected department prop
}

export const Dashboard: React.FC<Props> = ({ data, selectedDepartment }) => {
  // Define department configurations
  const departmentConfig = {
    AMBALAM: {
      name: 'AMBALAM',
      icon: Building2,
      primaryColor: 'purple',
      secondaryColor: 'indigo',
      lightBg: 'bg-purple-50',
      mediumBg: 'bg-purple-100',
      darkBg: 'bg-purple-200',
      textPrimary: 'text-purple-700',
      textSecondary: 'text-purple-600',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-indigo-500',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-600'
    },
    ILLAM: {
      name: 'ILLAM',
      icon: Home,
      primaryColor: 'emerald',
      secondaryColor: 'teal',
      lightBg: 'bg-emerald-50',
      mediumBg: 'bg-emerald-100',
      darkBg: 'bg-emerald-200',
      textPrimary: 'text-emerald-700',
      textSecondary: 'text-emerald-600',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-teal-500',
      borderColor: 'border-emerald-500',
      iconColor: 'text-emerald-600'
    }
  } as const;

  const dept = departmentConfig[selectedDepartment];
  const deptData = data[selectedDepartment];
  const Icon = dept.icon;

  // If no data, show loading or empty state
  if (!deptData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">No data available for {selectedDepartment}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Single Department Dashboard */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Department Header */}
        <div className={`${dept.lightBg} p-6 border-b ${dept.borderColor}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${dept.mediumBg}`}>
              <Icon className={`w-8 h-8 ${dept.iconColor}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{dept.name}</h2>
              <p className="text-sm text-gray-600">Department Overview</p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Income Card */}
            <div className={`${dept.lightBg} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${dept.mediumBg}`}>
                  <TrendingUp className={`w-5 h-5 ${dept.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +{((deptData.income / (deptData.income + deptData.expenditure || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className={`text-2xl font-bold ${dept.textSecondary}`}>
                ₹{deptData.income.toLocaleString()}
              </p>
            </div>

            {/* Expense Card */}
            <div className={`${dept.lightBg} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${dept.mediumBg}`}>
                  <TrendingDown className={`w-5 h-5 ${dept.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  {((deptData.expenditure / (deptData.income + deptData.expenditure || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{deptData.expenditure.toLocaleString()}
              </p>
            </div>

            {/* Balance Card */}
            <div className={`bg-gradient-to-r ${dept.gradientFrom} ${dept.gradientTo} rounded-xl p-5 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                  Net Balance
                </span>
              </div>
              <p className="text-sm text-white/80 mb-1">Current Balance</p>
              <p className="text-2xl font-bold">
                ₹{deptData.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${dept.textPrimary}`}>
                Recent Activity
              </h3>
              <span className="text-xs text-gray-500">
                Last {deptData.recent_transactions.length} transactions
              </span>
            </div>

            <div className="space-y-3">
              {deptData.recent_transactions.map((t: any, index: number) => (
                <div 
                  key={t.id || index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      t.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-800">{t.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              {deptData.recent_transactions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No recent transactions</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Transaction Count</p>
              <p className="text-xl font-bold text-gray-800">
                {deptData.recent_transactions.length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Avg Transaction</p>
              <p className="text-xl font-bold text-gray-800">
                ₹{deptData.recent_transactions.length > 0 
                  ? Math.round(
                      (deptData.income + deptData.expenditure) / 
                      deptData.recent_transactions.length
                    ).toLocaleString()
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};