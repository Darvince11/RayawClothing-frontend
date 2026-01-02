import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white font-sans relative">
      <Navbar />
      
      {/* The Page Content loads here */}
      <Outlet />
      
      {/* IMPORTANT: There is NO notification code here.
         It is now handled globally in App.jsx.
      */}
    </div>
  );
}