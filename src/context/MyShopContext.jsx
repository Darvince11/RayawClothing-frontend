import { createContext, useContext, useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query'; 
import { loginAPI, registerAPI, verifyEmailAPI, resendCodeAPI, fetchProductsAPI } from '../services/fetch';

const ShopContext = createContext();

// Email of a user who signed up but hasn't verified yet (survives a page refresh)
export const PENDING_EMAIL_KEY = 'pending_verification_email';

// Prefer the server's message; fall back for network errors
const getErrorMessage = (error, fallback) => {
  if (error.response) return error.response.data?.message || error.response.data?.error || fallback;
  if (error.isAxiosError) return fallback;
  return error.message || fallback;
};

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null); 

  // --- INFINITE SCROLL PRODUCTS ---
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProductsAPI,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_cursor || undefined,
    staleTime: 1000 * 60 * 5, 
  });

  // --- DATA MAPPING ---
  const products = data?.pages?.flatMap(page => {
    const rawProducts = page?.data || [];
    return rawProducts.map(item => ({
      id: item.id,
      name: item.product_name,           
      description: item.product_description,
      price: item.price,
      image: item.image_url,             
      category: item.category,
      status: item.product_status
    }));
  }) || [];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); 
  };

  // Load User on Startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
        logout(); 
      }
    }
  }, []);

  // --- HELPER: HANDLE AUTH SUCCESS ---
  const handleAuthSuccess = (responseData, method) => {
    const { user_info, access_token, refresh_token } = responseData.data;

    if (!access_token || !user_info) {
      throw new Error("Invalid server response: Missing token or user info.");
    }

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    const displayName = 
      user_info.first_name || 
      user_info.last_name || 
      user_info.email?.split('@')[0] || 
      "Customer";

    const userData = {
      id: user_info.id,
      first_name: displayName, 
      last_name: user_info.last_name || "",
      email: user_info.email,
      phone: user_info.phone_number
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    showNotification(
      method === 'login' ? `Welcome back, ${displayName}!` : `Email verified. Welcome, ${displayName}!`,
      "success"
    );
    return true;
  };

  // --- LOGIN FUNCTION (FIXED ERROR MESSAGE) ---
  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      
      console.log("Login Response:", response);

      if (!response.success) {
         throw new Error(response.message || "Login failed");
      }

      return handleAuthSuccess(response, 'login');

    } catch (error) {
      console.error("Login Error:", error);

      // --- THE FIX IS HERE ---
      // If the server says "401" (Unauthorized), it implies wrong credentials.
      if (error.response && error.response.status === 401) {
        showNotification("Invalid email or password", "error");
        return false;
      }

      // Fallback for other errors (Network, 500 Server Error, etc.)
      const msg = error.response?.data?.message || "Login failed. Please check your connection.";
      showNotification(msg, "error");
      return false;
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      
      if (!response.success) {
        throw new Error(response.message || "Signup failed.");
      }

      // Don't log in yet: the user must verify their email first.
      sessionStorage.setItem(PENDING_EMAIL_KEY, userData.email);
      showNotification("We sent a verification code to your email.", "success");
      return true;

    } catch (error) {
      console.error("Register Error:", error);
      showNotification(getErrorMessage(error, "Signup failed."), "error");
      return false;
    }
  };

  // --- VERIFY EMAIL ---
  // Returns 'loggedIn' (server sent tokens), 'verified' (user must log in), or false.
  const verifyEmail = async (email, code) => {
    try {
      const response = await verifyEmailAPI(email, code);

      if (!response.success) {
        throw new Error(response.message || "Verification failed.");
      }

      sessionStorage.removeItem(PENDING_EMAIL_KEY);

      if (response.data?.access_token && response.data?.user_info) {
        handleAuthSuccess(response, 'verify');
        return 'loggedIn';
      }

      showNotification("Email verified! Please log in.", "success");
      return 'verified';

    } catch (error) {
      console.error("Verify Error:", error);
      showNotification(getErrorMessage(error, "Invalid or expired code."), "error");
      return false;
    }
  };

  const resendCode = async (email) => {
    try {
      const response = await resendCodeAPI(email);

      if (!response.success) {
        throw new Error(response.message || "Could not resend the code.");
      }

      showNotification("A new code has been sent to your email.", "success");
      return true;

    } catch (error) {
      console.error("Resend Error:", error);
      showNotification(getErrorMessage(error, "Could not resend the code."), "error");
      return false;
    }
  };

  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    showNotification("Profile updated!", "success");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    showNotification("Logged out.", "success");
  };

  // --- CART LOGIC ---
  const addToCart = (product, size) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id && item.size === size);
      return exists 
        ? prev.map(item => item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, size, quantity: 1 }];
    });
    showNotification("Added to cart", "success");
  };

  const removeFromCart = (id, size) => setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
  const updateQuantity = (id, size, delta) => setCart(prev => prev.map(item => item.id === id && item.size === size ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider value={{ 
      user, register, verifyEmail, resendCode, login, logout, updateUserProfile,
      products, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading,
      cart, addToCart, removeFromCart, updateQuantity, 
      getCartCount, getTotalPrice, clearCart, notification 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);