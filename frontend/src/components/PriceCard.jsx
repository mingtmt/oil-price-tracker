import React from 'react';
import { Fuel } from 'lucide-react';

const PriceCard = ({ data, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 
        ${isActive 
          ? 'border-blue-600 bg-blue-50 shadow-md' 
          : 'border-gray-100 bg-white hover:border-blue-200'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Fuel size={20} />
        </div>
        <span className="text-xs font-medium text-gray-400">Vùng 1</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-500 truncate">{data.product_name}</h3>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-gray-800">{data.price_v1.toLocaleString()}</span>
        <span className="text-xs font-medium text-gray-400 uppercase">VND/L</span>
      </div>
    </div>
  );
};

export default PriceCard;