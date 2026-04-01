import React, { useState, useEffect } from 'react';
import api from './api/axios';
import PriceCard from './components/PriceCard';
import HistoryChart from './components/HistoryChart';
import { LayoutDashboard, RefreshCcw } from 'lucide-react';

function App() {
  const [latest, setLatest] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/prices/latest');
      setLatest(res.data);
      if (res.data.length > 0) {
        setSelected(res.data[0]);
        fetchHistory(res.data[0].product_name);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (name) => {
    try {
      const res = await api.get(`/prices/history/${name}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    fetchHistory(item.product_name);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" /> Petrol Price Insight
            </h1>
            <p className="text-gray-500 text-sm">Dashboard dành cho điều phối vận tải biển & bộ</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {latest.map(item => (
            <PriceCard 
              key={item.id} 
              data={item} 
              isActive={selected?.product_name === item.product_name}
              onClick={() => handleSelect(item)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HistoryChart 
              data={history} 
              title={selected?.product_name || "Đang tải..."} 
            />
          </div>
          <div className="lg:col-span-1">
            {/* Đây là nơi chúng ta sẽ đặt Logistics Calculator ở bước sau */}
            <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 h-full flex items-center justify-center text-gray-400">
              Phần tính toán chi phí vận tải (Sắp ra mắt)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;