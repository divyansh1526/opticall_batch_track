import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if backend runs on different port
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const login = async (credentials: { username: string; password: string }) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export interface ReportParams {
  type: 'batch' | 'call';
  fromDate: string;
  toDate: string;
}

export const fetchReport = async (params: ReportParams) => {
  try {
    const response = await api.get('/report', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export default api;
