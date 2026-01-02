
// Helper to generate mock data so it's consistent
const generateMockProducts = () => Array(8).fill(null).map((_, index) => ({
  id: `prod-${index + 1}`, // Consistent IDs like prod-1, prod-2
  name: index % 2 === 0 ? "Oversized Sweater" : "Classic Knit Pullover",
  description: "Crafted from premium, breathable materials, this piece offers unmatched comfort and timeless style. Perfect for layering or wearing on its own, designed for modern living.",
  price: 150.00 + (index * 10),
  currency: "GHS",
  // Using consistent Unsplash IDs for demo purposes
  image: index % 2 === 0 
    ? "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop" 
    : "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1000&auto=format&fit=crop"
}));

const mockDb = generateMockProducts();

// Fetch All Products
export const fetchProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDb;
};

// --- NEW FUNCTIONS ---

// Fetch Single Product by ID
export const fetchProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const product = mockDb.find(p => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
};

// Mock Login
export const loginUser = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log("Logging in with:", credentials);
  return { success: true, user: { name: "Rayaw User" } };
};

// Mock Signup
export const signupUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log("Signing up:", userData);
  return { success: true };
};