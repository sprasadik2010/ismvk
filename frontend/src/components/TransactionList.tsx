import React, { useState } from 'react';
import { type Transaction } from '../types';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
}

export const TransactionList: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-gray-500">No transactions found for this period</p>
      </div>
    );
  }

  const handleEdit = (transaction: Transaction) => {
    if (onEdit) {
      setActionInProgress(transaction.id);
      onEdit(transaction);
      setTimeout(() => setActionInProgress(null), 300);
    }
  };

  const handleDelete = (id: number) => {
    if (onDelete && window.confirm('Are you sure you want to delete this transaction?')) {
      setActionInProgress(id);
      onDelete(id);
      setTimeout(() => setActionInProgress(null), 300);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mobile View - Cards */}
      <div className="block sm:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`
              bg-white border rounded-lg overflow-hidden
              ${expandedId === transaction.id ? 'border-blue-300 shadow-md' : 'border-gray-200'}
              transition-all duration-200
            `}
          >
            {/* Card Header - Always visible */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(transaction.date), 'dd MMM yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-base font-semibold ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </span>
                  {expandedId === transaction.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {transaction.type === 'INCOME' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    <ArrowUpCircle className="w-3 h-3 mr-1" />
                    Income
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    <ArrowDownCircle className="w-3 h-3 mr-1" />
                    Expense
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {transaction.category?.name || 'Uncategorized'}
                </span>
              </div>
            </div>

            {/* Expanded Details with Actions */}
            {expandedId === transaction.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                {/* Transaction Details */}
                {transaction.notes && (
                  <div className="text-sm">
                    <span className="text-xs text-gray-500 block mb-1">Notes:</span>
                    <p className="text-gray-700 bg-white p-2 rounded border border-gray-200">
                      {transaction.notes}
                    </p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  {onEdit && (
                    <button
                      onClick={() => handleEdit(transaction)}
                      disabled={actionInProgress === transaction.id}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 
                        px-3 py-2.5 rounded-lg text-sm font-medium
                        ${actionInProgress === transaction.id 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 active:bg-blue-200'
                        }
                        transition-colors
                      `}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      disabled={actionInProgress === transaction.id}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 
                        px-3 py-2.5 rounded-lg text-sm font-medium
                        ${actionInProgress === transaction.id 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 active:bg-red-200'
                        }
                        transition-colors
                      `}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {transaction.category?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'INCOME' ? (
                      <><ArrowUpCircle className="w-3 h-3 mr-1" /> Income</>
                    ) : (
                      <><ArrowDownCircle className="w-3 h-3 mr-1" /> Expense</>
                    )}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-3">
                    {onEdit && (
                      <button
                        onClick={() => handleEdit(transaction)}
                        disabled={actionInProgress === transaction.id}
                        className={`text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={actionInProgress === transaction.id}
                        className={`text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};