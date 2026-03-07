import React from 'react';
import { type Transaction, type Department, type DateRange } from '../types';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react';

interface Props {
  department: Department;
  dateRange: DateRange;
  transactions: Transaction[];
}

export const BalanceSheet: React.FC<Props> = ({ department, dateRange, transactions }) => {
  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenditure = transactions
      .filter(t => t.type === 'EXPENDITURE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenditure;
    
    return { income, expenditure, balance };
  };

  const { income, expenditure, balance } = calculateTotals();

  const handleExport = () => {
    const data = {
      department,
      period: {
        start: format(dateRange.startDate, 'dd/MM/yyyy'),
        end: format(dateRange.endDate, 'dd/MM/yyyy')
      },
      summary: { income, expenditure, balance },
      transactions: transactions.map(t => ({
        date: format(new Date(t.date), 'dd/MM/yyyy'),
        description: t.description,
        category: t.category?.name,
        type: t.type,
        amount: t.amount
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance-sheet-${department}-${format(dateRange.startDate, 'yyyy-MM-dd')}.json`;
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Balance Sheet</h2>
        <button
          onClick={handleExport}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Export as JSON"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>Period: {format(dateRange.startDate, 'dd MMM yyyy')} - {format(dateRange.endDate, 'dd MMM yyyy')}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-800">{department}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Total Income</span>
          </div>
          <span className="text-lg font-semibold text-green-600">₹{income.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-gray-700">Total Expenditure</span>
          </div>
          <span className="text-lg font-semibold text-red-600">₹{expenditure.toLocaleString()}</span>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6" />
              <span className="font-medium">Net Balance</span>
            </div>
            <span className="text-2xl font-bold">₹{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Transaction Summary</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{format(new Date(transaction.date), 'dd/MM/yyyy')}</p>
                </div>
                <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};