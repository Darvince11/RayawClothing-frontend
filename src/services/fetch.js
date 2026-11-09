import axios from 'axios';

// API URL (Live Backend)
const API_URL = import.meta.env.VITE_LOCAL_BACKEND_URL

// Standard JSON Headers
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const api=axios.create({
  baseURL:API_URL,
  headers:{
    'Content-Type': 'application/json',
  }
})

const refreshClient=axios.create({
  baseURL:API_URL,
  headers:{
    'Content-Type': 'application/json'
  },
})

let refreshPromise=null

api.interceptors.request.use((config)=>{
  const accessToken=localStorage.getItem('access_token')??""
  config.headers.Authorization=`Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  (response)=>{
    return response;
  },
  async (error)=>{
    const originalRequest=error.config

    if (error.response.status!==401){
      return Promise.reject(error)
    }

    try{
      // If no refresh is currently running, start one.
      refreshPromise = await refreshClient.post("/auth/refresh",
        {
          refresh_token: localStorage.getItem('refresh_token')??""
        })

      const newAccessToken = refreshPromise.data.data.access_token;
      localStorage.setItem('access_token', newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    }catch(error){
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href="/login"
    }

   return Promise.reject(error)
  }
)

// --- AUTH SERVICES ---

export const loginAPI = async (email, password) => {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  const response = await api.post(
    "/login",
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
  const response = await api.post("/signup", userData, jsonConfig);
  return response.data;
};

// --- PRODUCT SERVICES ---

// 1. Fetch List (Infinite Scroll)
export const fetchProductsAPI = async ({ pageParam = null }) => {
  // Handles pagination cursor logic for infinite scroll
  const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
  const url = `${API_URL}/products?limit=3${cursorParam}`;
  
  const response = await api.get(url);
  return response.data; 
};

// 2. Fetch Single Product Details
export const fetchProductDetailsAPI = async (id) => {
  const response = await api.get(`/products/${id}`);
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
  const response = await api.post(
    "/add-payment-history",
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



export const verifyPayment = async ({reference})=>{
  const response = await api.get(`/verify-payment?${reference}`)
  return response.data
}

// ORDER SERVICES

export const addOrder = async ({
  products,   
  user_id,       
  email 
})=>{
  const response = await api.post(
    "/orders",
    {
      products:products,
      user_id:user_id,
      email:email
    }
  )

  return response.data
}

export const getOrderByUserId = async (user_id)=>{
  const response = await api.get(`/orders/user/${user_id}`)
  return response.data.data
}

export const getOrderById = async (order_id)=>{
  const response = await api.get(`/orders/${order_id}`)
  return response.data.data
}

export const getPaymentHistoryByUserId = async (user_id)=>{
  const response = await api.get(`/payments/users/${user_id}`)
  return response.data.data
}