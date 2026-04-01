import React from 'react';
import { Fuel, MapPin } from 'lucide-react';

const PriceCard = ({ data, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 
        ${isActive 
          ? 'border-blue-600 bg-blue-50 shadow-sm' 
          : 'border-gray-100 bg-white hover:border-blue-200'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Fuel size={18} />
        </div>
        <div className="text-right">
          <h3 className="text-sm font-bold text-gray-700 truncate w-32">{data.product_name}</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Niêm yết Petrolimex</p>
        </div>
      </div>

      <div className="space-y-2">
        {/* Vùng 1 */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={10} /> Vùng 1
          </span>
          <span className="text-lg font-bold text-gray-800">
            {data.price_v1.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">đ</span>
          </span>
        </div>

        {/* Vùng 2 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={10} /> Vùng 2
          </span>
          <span className="text-lg font-bold text-blue-600">
            {data.price_v2.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">đ</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;