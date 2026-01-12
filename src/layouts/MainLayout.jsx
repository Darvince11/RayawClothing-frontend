import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white font-sans relative">
      <Navbar />
      <Outlet />
    </div>
  );
}