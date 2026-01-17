import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { updateOrderStatus as updateOrderStatusApi } from "../api/order";
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
  addOrder: (
    order: Omit<Order, "id" | "createdAt" | "time" | "status"> &
      Partial<Pick<Order, "id" | "createdAt" | "time" | "status">>
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void> | void;
  getOrdersByRestaurant: (restaurantId: string) => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { accessToken } = useAuth();

  const mapStatusToApi = (status: Order["status"]) => {
    if (status === "completed") return "delivered";
    return status;
  };

  const addOrder = (
    orderData: Omit<Order, "id" | "createdAt" | "time" | "status"> &
      Partial<Pick<Order, "id" | "createdAt" | "time" | "status">>
  ): Order => {
    const now = new Date();
    const order: Order = {
      ...orderData,
      id: orderData.id || `ORDER-${Date.now()}`,
      status: orderData.status || "pending",
      createdAt: orderData.createdAt || now.toISOString(),
      time:
        orderData.time ||
        now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    const parsedId = Number(orderId);
    if (!accessToken || Number.isNaN(parsedId)) return;

    try {
      await updateOrderStatusApi(parsedId, mapStatusToApi(status), accessToken);
    } catch {
      // ignore for MVP
    }
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

