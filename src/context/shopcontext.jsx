import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; 
import { loginAPI, registerAPI, fetchProductsAPI } from '../services/fetch';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null); 

  // --- TANSTACK QUERY: AUTOMATIC PRODUCT FETCHING ---
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductsAPI,
    staleTime: 1000 * 60 * 5, 
  });

  // Notification Helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); 
  };

  // Load User from LocalStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  // --- LOGIN FUNCTION (UPDATED: CATCH-ALL NAME FIX) ---
  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      let userData = data.user || data;

      // Debugging: See exactly what the backend sends in the console
      console.log("Login Response Data:", userData);

      // CHECK ALL POSSIBLE SPELLINGS
      // We check 'first_name', then 'firstName', then 'name', etc.
      const userName = 
        userData.first_name || 
        userData.firstName || 
        userData.name || 
        userData.user_name || 
        "Customer"; 

      // Update the object with the correct standardized name
      userData = { ...userData, first_name: userName };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      showNotification(`Welcome back, ${userData.first_name}!`, "success");
      return true;
    } catch (error) {
      console.error("Login Failed:", error.response);
      const msg = error.response?.data?.error || "Invalid email or password";
      showNotification(msg, "error");
      return false;
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (userData) => {
    try {
      const data = await registerAPI(userData);
      let newUserData = data.user || data;

      // Force name from form data (Frontend Override)
      newUserData = {
        ...newUserData,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone
      };

      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      showNotification("Account created successfully!", "success");
      return true;
    } catch (error) {
      const rawMsg = error.response?.data?.error || "";
      if (rawMsg.includes("duplicate")) {
        showNotification("Phone number or email already taken", "error");
      } else {
        showNotification("Signup failed. Please try again.", "error");
      }
      return false;
    }
  };

  // --- UPDATE PROFILE FUNCTION ---
  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    showNotification("Profile updated successfully!", "success");
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showNotification("Logged out successfully.", "success");
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
      user, register, login, logout, updateUserProfile,
      products, 
      cart, addToCart, removeFromCart, updateQuantity, 
      getCartCount, getTotalPrice, clearCart, notification 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);