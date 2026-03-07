import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { type DashboardData } from '../types';

interface Props {
  data: DashboardData;
}

export const Dashboard: React.FC<Props> = ({ data }) => {
  const departments = ['ILLAM', 'AMBALAM'] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {departments.map(dept => {
        const deptData = data[dept];
        return (
          <div
            key={dept}
            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{dept}</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <p className="text-lg font-bold text-green-600 mt-1">
                  ₹{deptData.income.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Expense</span>
                </div>
                <p className="text-lg font-bold text-red-600 mt-1">
                  ₹{deptData.expenditure.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Balance</span>
                </div>
                <span className={`text-xl font-bold ${
                  deptData.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{deptData.balance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Transactions</h4>
              <div className="space-y-2">
                {deptData.recent_transactions.map((t: any) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{t.description}</span>
                    <span className={t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                      {t.type === 'INCOME' ? '+' : '-'}₹{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};