import { useState, useEffect } from 'react'
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { BalanceSheet } from './components/BalanceSheet';
import { DepartmentSelector } from './components/DepartmentSelector';
import { DateRangePicker } from './components/DateRangePicker';
import { api } from './services/api';
import { type Transaction, type Department, type DateRange, type DashboardData } from './types';
import { CategoryManager } from './components/CategoryManager';

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('AMBALAM');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchDashboardData();
  }, [selectedDepartment, dateRange]);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions(
        selectedDepartment,
        dateRange.startDate,
        dateRange.endDate
      );
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await api.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      await api.createTransaction(transaction);
      fetchTransactions();
      fetchDashboardData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      // Format date properly for the form
      // const formattedDate = new Date(transaction.date).toISOString().split('T')[0];
      
      // Set form data for editing
      setEditingTransaction(transaction);
      setShowForm(true);
      
      // Note: You'll need to pass the editing transaction to TransactionForm
      // You may need to modify TransactionForm to accept an optional transaction prop
    } catch (error) {
      console.error('Error preparing edit:', error);
    }
  };

  const handleUpdateTransaction = async (id: number, transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      await api.updateTransaction(id, transaction);
      fetchTransactions();
      fetchDashboardData();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      await api.deleteTransaction(id);
      await fetchTransactions(); // Refresh list
      await fetchDashboardData(); // Refresh dashboard
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const handleFormSubmit = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    if (editingTransaction) {
      await handleUpdateTransaction(editingTransaction.id, transaction);
    } else {
      await handleAddTransaction(transaction);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Finance Manager
            </h1>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <DepartmentSelector
                selected={selectedDepartment}
                onChange={setSelectedDepartment}
              />
              <button
                onClick={() => setShowCategoryManager(true)}
                className="px-4 py-2 bg-blue-400  text-white border border-gray-300 text-gray-700 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Categories
              </button>
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition-colors text-sm flex items-center"
              >
                <span className="mr-1">+</span>
                <span>Add</span>
              </button>
            </div>

            {/* Mobile Menu Button - Only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3">
            <div className="w-full mb-3">
              <DepartmentSelector
                selected={selectedDepartment}
                onChange={(dept) => {
                  setSelectedDepartment(dept);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
            <button
              onClick={() => {
                setShowCategoryManager(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              Manage Categories
            </button>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
            >
              Add Transaction
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard */}
        {dashboardData && (
          <Dashboard
            data={dashboardData}
            selectedDepartment={selectedDepartment}
          />
        )}

        {/* Mobile Date Range Picker - Only on mobile */}
        <div className="mt-4 md:hidden">
          <DateRangePicker range={dateRange} onChange={setDateRange} />
        </div>

        {/* Main Content */}
        <div className="mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Transactions - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Transactions</h2>
                {/* Desktop Date Range Picker */}
                <div className="hidden md:block">
                  <DateRangePicker range={dateRange} onChange={setDateRange} />
                </div>
              </div>
              <TransactionList
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>

          {/* Balance Sheet - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <BalanceSheet
              department={selectedDepartment}
              dateRange={dateRange}
              transactions={transactions}
            />
          </div>
        </div>

        {/* Mobile Floating Action Button - Only on mobile */}
        <button
          onClick={() => {
            setEditingTransaction(null);
            setShowForm(true);
          }}
          className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-30"
        >
          <span className="text-2xl">+</span>
        </button>

        {/* Transaction Form Modal - Responsive */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center p-4 z-50">
            <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTransaction(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <TransactionForm
                  department={selectedDepartment}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                  }}
                  initialData={editingTransaction ? {
                    date: new Date(editingTransaction.date).toISOString().split('T')[0],
                    description: editingTransaction.description,
                    amount: editingTransaction.amount.toString(),
                    type: editingTransaction.type,
                    category_id: editingTransaction.category_id.toString(),
                    notes: editingTransaction.notes || '',
                    department: editingTransaction.department
                  } : undefined}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Manager Modal */}
        {showCategoryManager && (
          <CategoryManager
            department={selectedDepartment}
            onClose={() => setShowCategoryManager(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;