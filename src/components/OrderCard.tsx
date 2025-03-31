import React, { useState, useEffect } from 'react';
import { Order } from '../types/order';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onComplete?: (id: string, elapsedTime: string) => void;
  onRestore?: (id: string) => void;
}

export default function OrderCard({ order, onComplete, onRestore }: OrderCardProps) {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    if (order.completed && order.finalElapsedTime) {
      setElapsedTime(order.finalElapsedTime);
      return;
    }

    const timer = setInterval(() => {
      const elapsed = Date.now() - order.timestamp;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [order.timestamp, order.completed, order.finalElapsedTime]);

  const getTimerColor = () => {
    if (order.completed) return 'text-brand-dark/60';
    const elapsed = Date.now() - order.timestamp;
    const minutes = elapsed / 60000;
    if (minutes < 1) return 'text-green-500';
    if (minutes < 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCardStyle = () => {
    if (order.completed) {
      return 'bg-brand-green/10 border-brand-green/20';
    }
    return 'bg-brand-blue/10 border-brand-blue/20';
  };

  return (
    <div className={`rounded-2xl shadow-sm p-6 border ${getCardStyle()}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium text-brand-dark">{order.customerName}</span>
        <span className={`text-lg font-bold ${getTimerColor()}`}>
          {elapsedTime}
        </span>
      </div>

      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <div>
              <span className="font-medium text-brand-dark">{item.quantity} {item.name}</span>
              <p className="text-sm text-brand-dark/60">{item.variant}</p>
            </div>
          </div>
        ))}
      </div>

      {order.completed ? (
        <button
          onClick={() => onRestore?.(order.id)}
          className="mt-4 flex items-center text-brand-dark/60 hover:text-brand-dark transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          <span>Restore</span>
        </button>
      ) : (
        <button
          onClick={() => onComplete?.(order.id, elapsedTime)}
          className="mt-4 w-full bg-brand-blue/20 text-brand-dark py-2.5 px-4 rounded-xl hover:bg-brand-blue/30 transition-colors"
        >
          Complete
        </button>
      )}
    </div>
  );
} 