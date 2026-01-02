import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

// YOUR BACKEND URL
const API_URL = "https://rayawclothing-backend.onrender.com"; 

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null); 

  // Notification Helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); 
  };

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

  // --- LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.status === 200) {
        let userData = response.data.user || response.data;

        // STRICT CHECK: If data is missing or doesn't have a name, FORCE "Customer"
        if (!userData || !userData.first_name) {
          userData = {
            first_name: "Customer", 
            email: email,
            token: "valid-session"
          };
        }

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        showNotification(`Welcome back!`, "success");
        return true;
      }
    } catch (error) {
      console.error("Login Failed:", error);
      showNotification("Invalid email or password", "error");
      return false;
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      
      if (response.status === 200 || response.status === 201) {
        
        let newUserData = response.data.user || response.data;

        // STRICT CHECK: If backend sends just a message (no name), FORCE "Customer"
        if (!newUserData || !newUserData.first_name) {
          newUserData = {
            first_name: "Customer", // Forces "Customer" to appear
            email: userData.email,
            phone: userData.phone,
            token: "valid-session"
          };
        }

        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
        showNotification("Account created successfully!", "success");
        return true;
      }
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showNotification("Logged out successfully.", "success");
  };

  // --- PRODUCTS & CART ---
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchProducts(); }, []);

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
      user, register, login, logout, 
      products, cart, addToCart, removeFromCart, updateQuantity, 
      getCartCount, getTotalPrice, clearCart, notification 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);