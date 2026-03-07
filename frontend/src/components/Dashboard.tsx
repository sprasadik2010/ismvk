import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Home, Building2 } from 'lucide-react';
import { type DashboardData } from '../types';

interface Props {
  data: DashboardData;
}

export const Dashboard: React.FC<Props> = ({ data }) => {
  const departments = [
    { 
      name: 'ILLAM', 
      icon: Home,
      primaryColor: 'emerald', // Green theme for ILLAM
      secondaryColor: 'teal',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    { 
      name: 'AMBALAM', 
      icon: Building2,
      primaryColor: 'purple', // Purple theme for AMBALAM
      secondaryColor: 'indigo',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {departments.map((dept) => {
        const deptData = data[dept.name];
        const Icon = dept.icon;
        
        return (
          <div
            key={dept.name}
            className={`
              bg-white rounded-xl shadow-lg overflow-hidden
              transform hover:scale-105 transition-transform duration-300
              border-l-4 ${dept.name === 'ILLAM' ? 'border-l-emerald-500' : 'border-l-purple-500'}
              md:border-l-0
            `}
          >
            {/* Department Header with Icon */}
            <div className={`
              p-4 flex items-center space-x-3
              ${dept.name === 'ILLAM' ? 'bg-emerald-50' : 'bg-purple-50'}
            `}>
              <div className={`
                p-2 rounded-lg
                ${dept.name === 'ILLAM' ? 'bg-emerald-200' : 'bg-purple-200'}
              `}>
                <Icon className={`
                  w-5 h-5
                  ${dept.name === 'ILLAM' ? 'text-emerald-700' : 'text-purple-700'}
                `} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                <p className="text-xs text-gray-500">Department</p>
              </div>
            </div>

            <div className="p-4">
              {/* Income/Expense Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Income Card */}
                <div className={`
                  p-3 rounded-lg
                  ${dept.name === 'ILLAM' ? 'bg-emerald-50' : 'bg-purple-50'}
                `}>
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className={`
                      w-4 h-4
                      ${dept.name === 'ILLAM' ? 'text-emerald-600' : 'text-purple-600'}
                    `} />
                    <span className="text-xs text-gray-600">Income</span>
                  </div>
                  <p className={`
                    text-base sm:text-lg font-bold
                    ${dept.name === 'ILLAM' ? 'text-emerald-600' : 'text-purple-600'}
                  `}>
                    ₹{deptData.income.toLocaleString()}
                  </p>
                </div>

                {/* Expense Card */}
                <div className={`
                  p-3 rounded-lg
                  ${dept.name === 'ILLAM' ? 'bg-teal-50' : 'bg-indigo-50'}
                `}>
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingDown className={`
                      w-4 h-4
                      ${dept.name === 'ILLAM' ? 'text-teal-600' : 'text-indigo-600'}
                    `} />
                    <span className="text-xs text-gray-600">Expense</span>
                  </div>
                  <p className={`
                    text-base sm:text-lg font-bold
                    ${dept.name === 'ILLAM' ? 'text-teal-600' : 'text-indigo-600'}
                  `}>
                    ₹{deptData.expenditure.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Balance Card - Distinct for each department */}
              <div className={`
                mt-3 p-4 rounded-lg
                ${dept.name === 'ILLAM' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                }
              `}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">Balance</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold">
                    ₹{deptData.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="mt-4">
                <h4 className={`
                  text-sm font-medium mb-2 flex items-center space-x-1
                  ${dept.name === 'ILLAM' ? 'text-emerald-700' : 'text-purple-700'}
                `}>
                  <span>Recent Transactions</span>
                  <span className="text-xs text-gray-400">(last 5)</span>
                </h4>
                <div className="space-y-2">
                  {deptData.recent_transactions.map((t: any) => (
                    <div key={t.id} className="flex justify-between items-center text-xs sm:text-sm p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 truncate max-w-[60%]">{t.description}</span>
                      <span className={`
                        font-medium px-2 py-1 rounded-full
                        ${t.type === 'INCOME' 
                          ? dept.name === 'ILLAM' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-purple-100 text-purple-700'
                          : 'bg-red-100 text-red-700'
                        }
                      `}>
                        {t.type === 'INCOME' ? '+' : '-'}₹{t.amount}
                      </span>
                    </div>
                  ))}
                  
                  {deptData.recent_transactions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No recent transactions</p>
                  )}
                </div>
              </div>

              {/* Mobile Department Badge */}
              <div className="mt-3 md:hidden">
                <span className={`
                  inline-block px-3 py-1 text-xs font-medium rounded-full
                  ${dept.name === 'ILLAM' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-purple-100 text-purple-700'
                  }
                `}>
                  {dept.name} Department
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};