export interface OrderItem {
  name: string;
  quantity: number;
  variant: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  timestamp: number;
  completed: boolean;
  completedAt?: number;
  finalElapsedTime?: string;
  customerName: string;
}

export type TabType = 'todo' | 'completed'; 