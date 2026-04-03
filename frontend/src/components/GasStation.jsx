import React, { useState } from 'react';
import { Row, Col, Card, Typography, Progress } from 'antd';

const { Title } = Typography;

const GasStation = ({ crawledPrices }) => {
  const vehicles = [
    { id: '1', name: 'Air Blade', capacity: 5.5, icon: '🛵', desc: 'Xe tay ga phổ thông' },
    { id: '2', name: 'Vision', capacity: 5.2, icon: '🛵', desc: 'Xe tay ga nhỏ gọn' },
    { id: '3', name: 'Winner X', capacity: 4.5, icon: '🏍️', desc: 'Xe số thể thao' },
    { id: '4', name: 'SH Mode', capacity: 5.5, icon: '🛵', desc: 'Xe tay ga cao cấp' },
    { id: '5', name: 'Wave Alpha', capacity: 4.0, icon: '🚲', desc: 'Xe số tiết kiệm' },
    { id: '6', name: 'Ô tô (Sedan)', capacity: 50, icon: '🚗', desc: 'Xe hơi 4 bánh' },
  ];

  const [userSelectedFuel, setUserSelectedFuel] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  const fuelList = Object.values(crawledPrices || {});
  const effectiveFuel = userSelectedFuel || fuelList[0] || null;

  const currentPrice = effectiveFuel?.price_v1 || 0;
  const totalCost = selectedVehicle.capacity * currentPrice;

  return (
      <div className="p-10 min-h-screen text-white font-sans">
        <header className="text-center mb-12">
          <Title level={2} className="!text-orange-500 !m-0 !text-4xl">⛽ ĐỔ XĂNG ONLINE</Title>
        </header>
        
        <Row gutter={[24, 24]} justify="center">
          {/* Select vehicle */}
          <Col xs={24} lg={8}>
            <Card title="🚲 Chọn phương tiện" className='text-center'>
              <div className="space-y-3">
                {vehicles.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedVehicle(item)}
                    className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-all duration-300 text-start 
                      ${selectedVehicle.id === item.id 
                        ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-[1.02]' 
                        : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-black">{item.name}</div>
                        <div className="text-xs opacity-60">{item.desc}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold">{item.capacity}L</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Select fuel */}
          <Col xs={24} lg={8}>
            <Card title="💧 Chọn loại xăng" className='text-center'>
              <div className="space-y-4">
                {Object.entries(crawledPrices).map(([id, item]) => (
                  <div 
                    key={id}
                    onClick={() => setUserSelectedFuel(item)}
                    className={`p-6 rounded-2xl text-center cursor-pointer transition-all duration-300
                      ${effectiveFuel?.product_name === item.product_name 
                        ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-[1.02]' 
                        : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="text-lg font-bold mb-1">{item.product_name}</div>
                    <div className={`text-2xl font-black ${effectiveFuel?.product_name === item.product_name ? 'text-white' : 'text-orange-400'}`}>
                      {item.price_v1.toLocaleString()}đ/L
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Summary */}
          <Col xs={24} lg={8}>
            <Card title="🏁 Trạm xăng" className=" text-center">
              <div className="mb-8 p-6 rounded-3xl border border-zinc-700">
                <Progress 
                  type="dashboard" 
                  percent={100} 
                  strokeColor={{ '0%': '#f97316', '100%': '#fbbf24' }}
                  format={() => <div className="text-green font-bold text-xl">FULL</div>} 
                />
                <div className="mt-4">
                  <div className="text-5xl mb-2">{selectedVehicle.icon}</div>
                  <Title level={4} className="!m-0 !text-black">{selectedVehicle.name}</Title>
                </div>
              </div>
              
              <div className="space-y-2 text-left px-2 mb-6">
                <div className="flex justify-between text-black">
                  <span>Nhiên liệu:</span> <span className="text-black font-bold">{effectiveFuel?.product_name || "Đang tải..."}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Dung tích thực:</span> <span className="text-black font-bold">{selectedVehicle.capacity} Lít</span>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl border border-zinc-800 mb-6 group">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Tổng thanh toán</div>
                <div className="text-4xl font-black text-green-500 transition-all group-hover:scale-110">
                  {totalCost.toLocaleString()}đ
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
  );
};

export default GasStation;