const API_BASE_URL = 'https://ismvk-backend.onrender.com/api';

export const api = {
  // Category methods
  async getCategories(department?: string) {
    const url = department 
      ? `${API_BASE_URL}/categories/?department=${department}`
      : `${API_BASE_URL}/categories/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async getCategory(id: number) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async createCategory(category: { name: string; description?: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async updateCategory(id: number, category: { name: string; description?: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async deleteCategory(id: number) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  // Transaction methods
  async createTransaction(transaction: any) {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }
    return response.json();
  },

  async getTransactions(department?: string, startDate?: Date, endDate?: Date, skip: number = 0, limit: number = 100) {
    let url = `${API_BASE_URL}/transactions/`;
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (startDate) params.append('start_date', startDate.toISOString());
    if (endDate) params.append('end_date', endDate.toISOString());
    if (skip) params.append('skip', skip.toString());
    if (limit) params.append('limit', limit.toString());
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async getTransaction(id: number) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  async updateTransaction(id: number, transaction: any) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }
    return response.json();
  },

  async deleteTransaction(id: number) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }
    return response.json();
  },

  async deleteMultipleTransactions(ids: number[]) {
    const response = await fetch(`${API_BASE_URL}/transactions/bulk`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ids)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }
    return response.json();
  },

  // Balance Sheet methods
  async getBalanceSheet(department: string, startDate: Date, endDate: Date) {
    const url = `${API_BASE_URL}/balance-sheet/${department}?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  // Dashboard methods
  async getDashboardData(days: number = 30) {
    const url = `${API_BASE_URL}/dashboard/?days=${days}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  },

  // Statistics methods
  async getDepartmentStats(department: string, months: number = 6) {
    const url = `${API_BASE_URL}/stats/${department}?months=${months}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  }
};

// Type for API responses (optional but useful)
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};