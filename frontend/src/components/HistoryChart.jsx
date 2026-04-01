import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const HistoryChart = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[450px]">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Xu hướng giá: {title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="updated_date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#9ca3af', fontSize: 12}}
            dy={10}
          />
          <YAxis 
            hide={true} 
            domain={['dataMin - 500', 'dataMax + 500']} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="price_v1" 
            stroke="#2563eb" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;