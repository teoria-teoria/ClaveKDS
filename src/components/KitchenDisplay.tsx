import React, { useState } from 'react';
import { Order } from '../types/order';
import OrderCard from './OrderCard';
import ClaveLogo from '../assets/images/Clave Horizontal.png';

const DUMMY_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'Mike',
    items: [
      { name: 'Crispy Mania', quantity: 20, variant: 'Light Sugar' },
      { name: 'Tequeños', quantity: 8, variant: 'Regular' }
    ],
    timestamp: Date.now() - 89000, // 1:29
    completed: false,
    completedAt: undefined,
    finalElapsedTime: undefined
  },
  {
    id: '2',
    customerName: 'Mike',
    items: [
      { name: 'Crispy Mania', quantity: 14, variant: 'Light Sugar' },
      { name: 'Tequeños', quantity: 14, variant: 'Regular' }
    ],
    timestamp: Date.now() - 48000, // 0:48
    completed: false,
    completedAt: undefined,
    finalElapsedTime: undefined
  }
];

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>(DUMMY_ORDERS);
  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');

  const todoOrders = orders.filter(order => !order.completed);
  const completedOrders = orders.filter(order => order.completed);

  const handleOrderComplete = (orderId: string, elapsedTime: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            completed: true, 
            completedAt: Date.now(),
            finalElapsedTime: elapsedTime
          } 
        : order
    ));
  };

  const handleOrderRestore = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            completed: false, 
            completedAt: undefined,
            finalElapsedTime: undefined
          } 
        : order
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={ClaveLogo} 
            alt="Clave Logo" 
            className="h-12 object-contain"
          />
        </div>

        {/* Insight Banner */}
        <div className="bg-brand-blue/10 p-4 rounded-2xl mb-8 text-center border border-brand-blue/20">
          <p className="text-xl font-medium text-brand-dark">High Demand Projected in 1 Hour</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-8 py-3 rounded-2xl text-lg font-medium transition-all duration-300 ${
              activeTab === 'todo'
                ? 'bg-brand-blue/20 text-brand-dark flex-grow shadow-sm'
                : 'bg-transparent text-brand-dark/60 flex-none hover:bg-brand-blue/10'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-8 py-3 rounded-2xl text-lg font-medium transition-all duration-300 ${
              activeTab === 'completed'
                ? 'bg-brand-green/20 text-brand-dark flex-grow shadow-sm'
                : 'bg-transparent text-brand-dark/60 flex-none hover:bg-brand-green/10'
            }`}
          >
            Complete
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTab === 'todo' && todoOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onComplete={handleOrderComplete}
            />
          ))}
          {activeTab === 'completed' && completedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onRestore={handleOrderRestore}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 