import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HistoryChart = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[450px] w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Phân tích chênh lệch Vùng 1 & 2: {title}</h3>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="updated_date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}}
            dy={10}
          />
          <YAxis 
            hide={false}
            orientation="right"
            domain={['dataMin - 100', 'dataMax + 100']}
            tick={{fill: '#9ca3af', fontSize: 10}}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value) => [`${value.toLocaleString()} VND/L`]}
          />
          <Legend iconType="circle" verticalAlign="top" align="right" height={36}/>
          
          {/* Đường giá Vùng 1 */}
          <Line 
            name="Vùng 1"
            type="monotone" 
            dataKey="price_v1" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#2563eb' }}
            activeDot={{ r: 8 }}
          />
          
          {/* Đường giá Vùng 2 */}
          <Line 
            name="Vùng 2"
            type="monotone" 
            dataKey="price_v2" 
            stroke="#f59e0b" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#f59e0b' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;