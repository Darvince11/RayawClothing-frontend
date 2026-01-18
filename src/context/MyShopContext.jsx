import { createContext, useContext, useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query'; 
import { loginAPI, registerAPI, fetchProductsAPI } from '../services/fetch';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  
  // --- 1. USER STATE ---
  const [user, setUser] = useState(null);

  // --- 2. CART STATE (With Persistence) ---
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("rayaw_cart");
      return savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart load error:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("rayaw_cart", JSON.stringify(cart));
  }, [cart]);

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

  // --- EXPOSED NOTIFICATION FUNCTION ---
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
      method === 'login' ? `Welcome back, ${displayName}!` : "Account created successfully!", 
      "success"
    );
    return true;
  };

  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      if (!response.success) {
         throw new Error(response.message || "Login failed");
      }
      return handleAuthSuccess(response, 'login');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showNotification("Invalid email or password", "error");
        return false;
      }
      const msg = error.response?.data?.message || "Login failed. Please check your connection.";
      showNotification(msg, "error");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }
      return handleAuthSuccess(response, 'register');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Signup failed.";
      showNotification(msg, "error");
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

  const addToCart = (product, size) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (exists) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { ...product, selectedSize: size, quantity: 1 }];
      }
    });
    showNotification("Added to cart", "success");
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id, size, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id && item.selectedSize === size 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider value={{ 
      user, register, login, logout, updateUserProfile,
      products, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading,
      cart, addToCart, removeFromCart, updateQuantity, 
      getCartCount, getTotalPrice, clearCart, 
      notification, showNotification // <--- ADDED THIS SO YOU CAN USE IT!
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);