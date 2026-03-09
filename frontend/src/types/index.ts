export type Department = 'ILLAM' | 'AMBALAM';
export type TransactionType = 'INCOME' | 'EXPENDITURE';

export interface Category {
  id: number;
  name: string;
  department: Department;
  description?: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  department: Department;
  category_id: number;
  notes?: string;
  created_at: string;
  category?: Category;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface BalanceSheet {
  department: Department;
  total_income: number;
  total_expenditure: number;
  balance: number;
  transactions: Transaction[];
  period_start: string;
  period_end: string;
}

export interface DepartmentData {
  balance: number;
  income: number;
  expenditure: number;
  recent_transactions: Transaction[];
}

export interface DashboardData {
  AMBALAM: DepartmentData;
  ILLAM: DepartmentData;
}