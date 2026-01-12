import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Import all the providers
import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/shopcontext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Create the Query Client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Layer 1: TanStack Query */}
    <QueryClientProvider client={queryClient}>
      
      {/* Layer 2: Router */}
      <BrowserRouter>
        
        {/* Layer 3: Shop Data */}
        <ShopProvider>
          <App />
        </ShopProvider>
      
      </BrowserRouter>

    </QueryClientProvider>
  </React.StrictMode>,
);