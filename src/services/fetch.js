import axios from 'axios';

// API URL (Live Backend)
const API_URL = "https://rayawclothing-backend.onrender.com";

const jsonConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// --- AUTH SERVICES ---
export const loginAPI = async (email, password) => {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  const response = await axios.post(
    `${API_URL}/login`,
    { email: cleanEmail, user_password: cleanPassword },
    jsonConfig
  );
  return response.data; 
};

export const registerAPI = async (userData) => {
  // We send the full object (first_name, last_name, phone, etc.)
  const response = await axios.post(`${API_URL}/signup`, userData, jsonConfig);
  return response.data;
};

// --- PRODUCT SERVICES ---
export const fetchProductsAPI = async ({ pageParam = null }) => {
  // Handles pagination cursor
  const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
  const url = `${API_URL}/products?limit=3${cursorParam}`;
  const response = await axios.get(url);
  return response.data; 
};