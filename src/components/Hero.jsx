// src/components/Hero.jsx
import React from 'react';

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      <div className="bg-[#FFC107] rounded-3xl p-10 md:p-16 relative overflow-hidden flex items-center min-h-[300px]">
        
        {/* Text Content */}
        <div className="relative z-10 max-w-lg">
          
          {/* TITLE: Inter, Bold, 40px, White text with "Rayaw" in Black */}
          <h1 
            style={{ fontFamily: "'Inter', sans-serif" }} 
            className="text-[40px] leading-tight font-bold mb-4 text-white"
          >
            Explore the <span className="text-black">Rayaw</span> collection
          </h1>
          
          {/* SUBTEXT: Inter, Normal, Readable size */}
          <p 
            style={{ fontFamily: "'Inter', sans-serif" }} 
            className="text-gray-900 mb-6 text-base md:text-lg font-normal opacity-90"
          >
            Curated pieces designed for modern living, and quality essentials, thoughtfully selected.
          </p>

        </div>

        {/* Decorative Image Placeholder */}
        <div className="absolute right-0 top-0 h-full w-1/3 md:w-1/2 pointer-events-none">
           <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop" 
            alt="Collection"
            className="h-full w-full object-cover object-left opacity-90"
            style={{ 
              maskImage: 'linear-gradient(to right, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black)' 
            }}
           />
        </div>

      </div>
    </div>
  );
}