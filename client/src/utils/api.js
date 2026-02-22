// API configuration
// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');

// Helper function to make API calls
export const apiRequest = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                // If response is not JSON, use default message
            }

            if (response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login';
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        // If it's a network error or 404, provide helpful message
        if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
            throw new Error('Server endpoint not found. Please make sure the server is running and restarted with the latest code.');
        }
        throw error;
    }
};

// Product API functions
export const productAPI = {
    getAll: () => apiRequest('/products'),
    getById: (id) => apiRequest(`/products/${id}`),
    create: (data) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Auth API functions
export const authAPI = {
    register: (data) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMe: () => apiRequest('/auth/me'),
};


// Order API functions
export const orderAPI = {
    create: (data) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getById: (id) => apiRequest(`/orders/${id}`),
    getMyOrders: () => apiRequest('/orders/myorders'),
};

// Admin API functions
export const adminAPI = {
    getStats: () => apiRequest('/admin/stats'),
    getAllOrders: () => apiRequest('/admin/orders'),
    getPendingOrdersCount: () => apiRequest('/admin/orders/pending/count'),
    updateOrderStatus: (id, status) => apiRequest(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
};


