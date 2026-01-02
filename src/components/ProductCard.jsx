// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    // Card Container: 
    // - Fixed Width 256px, Height 421px
    // - Rounded corners 12px
    // - Overflow Hidden
    <div className="w-[256px] h-[421px] flex flex-col p-0 bg-white rounded-[12px] overflow-hidden group relative shadow-sm border border-gray-100">
      
      {/* 1. Image Section: Fixed 256x272 */}
      <div className="w-[256px] h-[272px] bg-gray-100 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
        />
      </div>

      {/* 2. Content Section */}
      {/* Added 'px-4' (16px padding) to sides so text doesn't touch edges */}
      <div className="flex flex-col gap-[15px] mt-[15px] px-4">
        
        {/* Title & Price */}
        <div className="flex flex-col gap-1">
          <h3 
            style={{ fontFamily: "'Inter', sans-serif" }} 
            className="text-black font-bold text-base truncate"
          >
            {product.name}
          </h3>
          <p 
            style={{ fontFamily: "'Inter', sans-serif" }} 
            className="text-black font-normal text-sm"
          >
            {product.currency || "GHS"} {product.price.toFixed(2)}
          </p>
        </div>

        {/* View Details Button */}
        <Link 
          to={`/product/${product.id}`}
          className="w-full bg-black text-white h-[45px] rounded-lg font-medium text-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}