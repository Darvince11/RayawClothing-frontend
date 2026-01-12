import axios from 'axios';

// 1. Centralized API URL
const API_URL = "https://rayawclothing-backend.onrender.com";

// 2. Configuration for JSON headers
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// --- AUTH SERVICES ---

export const loginAPI = async (email, password) => {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  // Note: Your backend expects 'user_password'
  const response = await axios.post(
    `${API_URL}/login`,
    { email: cleanEmail, user_password: cleanPassword },
    jsonConfig
  );
  return response.data; 
};

export const registerAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// --- PRODUCT SERVICES (Make sure this part is copied!) ---

export const fetchProductsAPI = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};