import axios from 'axios';

// API URL (Live Backend)
const API_URL = import.meta.env.VITE_BACKEND_URL

// Standard JSON Headers
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

function path(path){
  return `${API_URL}${path}`;
}

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

// PAYMENT SERVICES

export const addPaymentHistoty = async ({
  order_id,
  reference,
  currency,
  payment_method,
  amount,
  payment_status
}) => {
  const response = await axios.post(
    path("/add-payment-history"),
  {
    order_id:order_id,
    reference:reference,
    currency:currency,
    payment_method:payment_method,
    amount:amount,
    payment_status: payment_status
  }
)

  return response.data
}

export const initializePayment = async ({email})=>{
  const response = await axios.post(
    path("/payment-initialize"),
    {email:email}
  )
  return response.data
}

export const verifyPayment = async ({reference})=>{
  const response = await axios.get(path(`/verify-payment?${reference}`))
  return response.data
}

// ORDER SERVICES

export const addOrder = async ({
  products,   
  user_id,       
  paymentMethod,
  total_amount  
})=>{
  const response = await axios.post(
    path("/orders"),
    {
      products:products,
      userId:user_id,
      paymentMethod:paymentMethod,
      total_amount:total_amount
    }
  )

  return response.data
}

export const addOrderItem = async ({
  order_id,  
  product_id,
  quantity 
})=>{
  const response = await axios.post(
    path(`/order-items`),
    {
      order_id:order_id,
      product_id:product_id,
      quantity:quantity
    }
  )

  return response.data
}

export const getOrderByUserId = async (user_id)=>{
  const response = await axios.get(path(`/orders/user/${user_id}`))
  return response.data
}