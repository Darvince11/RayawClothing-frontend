import axios from 'axios';

// API URL
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
    { email: cleanEmail, password: cleanPassword },
    jsonConfig
  );
  return response.data; 
};

export const registerAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData, jsonConfig);
  return response.data;
};

// --- PRODUCT SERVICES ---

// 1. Fetch List (Infinite Scroll)
export const fetchProductsAPI = async ({ pageParam = null }) => {
  const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
  const url = `${API_URL}/products?limit=3${cursorParam}`;
  const response = await axios.get(url);
  return response.data; 
};

// 2. NEW: Fetch Single Product Details
export const fetchProductDetailsAPI = async (id) => {
  // This calls: GET /products/123
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data; 
};