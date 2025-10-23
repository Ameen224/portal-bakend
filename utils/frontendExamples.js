// Frontend API Integration Examples
// These are example functions showing how to connect your frontend to the backend APIs

const API_BASE_URL = 'http://localhost:5000/api';

// Authentication API
const authAPI = {
  // Login Super Admin
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage or secure storage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

// Dashboard API
const dashboardAPI = {
  // Get dashboard statistics (Protected)
  getStats: async () => {
    try {
      const token = authAPI.getToken();
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }
};

// Clients API
const clientsAPI = {
  // Get all clients (Public)
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      return await response.json();
    } catch (error) {
      console.error('Get clients error:', error);
      throw error;
    }
  },

  // Add new client (Protected)
  add: async (clientData) => {
    try {
      const token = authAPI.getToken();
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Add client error:', error);
      throw error;
    }
  }
};

// Products API
const productsAPI = {
  // Get all products (Public)
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Add new product (Protected)
  add: async (productData) => {
    try {
      const token = authAPI.getToken();
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    }
  }
};

// Example usage in React/Vue/Angular components:

/*
// Login example
const handleLogin = async (email, password) => {
  try {
    const result = await authAPI.login(email, password);
    if (result.success) {
      console.log('Login successful:', result.data.user);
      // Redirect to dashboard
    } else {
      console.error('Login failed:', result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Get dashboard stats example
const loadDashboard = async () => {
  try {
    const stats = await dashboardAPI.getStats();
    if (stats.success) {
      console.log('Dashboard data:', stats.data);
      // Update UI with stats
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
};

// Add client example
const addNewClient = async (name, email, projects) => {
  try {
    const result = await clientsAPI.add({ name, email, projects });
    if (result.success) {
      console.log('Client added:', result.data.client);
      // Refresh client list
    }
  } catch (error) {
    console.error('Failed to add client:', error);
  }
};

// Get all products example
const loadProducts = async () => {
  try {
    const result = await productsAPI.getAll();
    if (result.success) {
      console.log('Products:', result.data.products);
      // Update UI with products
    }
  } catch (error) {
    console.error('Failed to load products:', error);
  }
};
*/

module.exports = {
  authAPI,
  dashboardAPI,
  clientsAPI,
  productsAPI
};