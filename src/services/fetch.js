import axios from 'axios';

// API URL (Live Backend)
const API_URL = "https://rayawclothing-backend.onrender.com";

// Standard JSON Headers
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
    { 
      email: cleanEmail, 
      // CRITICAL FIX: Mapping the frontend 'password' to backend 'user_password'
      user_password: cleanPassword 
    },
    jsonConfig
  );
  return response.data; 
};

export const registerAPI = async (userData) => {
  // We send the full object.
  // Note: Ensure your SignupPage passes 'user_password' inside userData!
  const response = await axios.post(`${API_URL}/signup`, userData, jsonConfig);
  return response.data;
};

// --- PRODUCT SERVICES ---

// 1. Fetch List (Infinite Scroll)
export const fetchProductsAPI = async ({ pageParam = null }) => {
  // Handles pagination cursor logic for infinite scroll
  const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
  const url = `${API_URL}/products?limit=3${cursorParam}`;
  
  const response = await axios.get(url);
  return response.data; 
};

// 2. Fetch Single Product Details
export const fetchProductDetailsAPI = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data; 
};