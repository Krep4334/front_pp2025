import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, OrderDetailOut, updateOrderStatus } from "../api/order";
import { Clock, Package, ArrowLeft, Loader2 } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "В процессе",
  confirmed: "В процессе",
  preparing: "В процессе",
  ready: "В процессе",
  delivering: "В процессе",
  completed: "Выполнен",
  delivered: "Выполнен",
  cancelled: "Отменен",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-orange-100 text-orange-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivering: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  delivered: "bg-gray-100 text-gray-800",
};

export function ActiveOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();
  const [orders, setOrders] = useState<OrderDetailOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/auth");
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Получаем активные заказы (не завершенные и не отмененные)
        const allOrders = await getUserOrders(accessToken);
        const activeOrders = allOrders.filter(
          (order) => order.status !== "completed" && order.status !== "cancelled" && order.status !== "delivered"
        );
        setOrders(activeOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить заказы");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, accessToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCancel = async (orderId: number) => {
    if (!accessToken) return;
    try {
      await updateOrderStatus(orderId, "cancelled", accessToken);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отменить заказ");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/profile"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">Активные заказы</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Нет активных заказов</h2>
            <p className="text-gray-500 mb-6">
              У вас пока нет активных заказов
            </p>
            <Link
              to="/customer"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Перейти к меню
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold">
                        Заказ #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Ресторан #{order.restaurant_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">
                      {order.total_amount} ₽
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Состав заказа:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.dish_id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.dish_name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {item.dish_price * item.quantity} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Доставка: {order.delivery_fee === 0 ? "Бесплатно" : `${order.delivery_fee} ₽`}
                    </span>
                    <span className="font-semibold">
                      Итого: {order.total_amount} ₽
                    </span>
                  </div>
                  {order.status === "pending" && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Отменить заказ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
