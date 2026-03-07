const API_BASE_URL = 'https://ismvk-backend.onrender.com/api';

export const api = {
  // Category methods
  async getCategories(department?: string) {
    const url = department 
      ? `${API_BASE_URL}/categories/?department=${department}`
      : `${API_BASE_URL}/categories/`;
    const response = await fetch(url);
    return response.json();
  },

  async createCategory(category: { name: string; description?: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return response.json();
  },

  async updateCategory(id: number, category: { name: string; description?: string; department: string }) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return response.json();
  },

  async deleteCategory(id: number) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Transaction methods
  async createTransaction(transaction: any) {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return response.json();
  },

  async getTransactions(department?: string, startDate?: Date, endDate?: Date) {
    let url = `${API_BASE_URL}/transactions/`;
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (startDate) params.append('start_date', startDate.toISOString());
    if (endDate) params.append('end_date', endDate.toISOString());
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url);
    return response.json();
  },

  async getBalanceSheet(department: string, startDate: Date, endDate: Date) {
    const url = `${API_BASE_URL}/balance-sheet/${department}?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`;
    const response = await fetch(url);
    return response.json();
  },

  async getDashboardData(days: number = 30) {
    const url = `${API_BASE_URL}/dashboard/?days=${days}`;
    const response = await fetch(url);
    return response.json();
  }
};