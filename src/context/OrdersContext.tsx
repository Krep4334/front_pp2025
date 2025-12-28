import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
    comment?: string;
  };
  status: "pending" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
  createdAt: string;
  time: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "time" | "status">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrdersByRestaurant: (restaurantId: string) => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (
    orderData: Omit<Order, "id" | "createdAt" | "time" | "status">
  ): Order => {
    const now = new Date();
    const order: Order = {
      ...orderData,
      id: `ORDER-${Date.now()}`,
      status: "pending",
      createdAt: now.toISOString(),
      time: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrdersByRestaurant = (restaurantId: string): Order[] => {
    return orders.filter((order) => order.restaurantId === restaurantId);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersByRestaurant,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}

