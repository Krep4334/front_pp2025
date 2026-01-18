import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, OrderOut } from "../api/order";
import { History, Package, MapPin, ArrowLeft, Loader2 } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Ожидает обработки",
  preparing: "Готовится",
  ready: "Готов к выдаче",
  delivering: "Доставляется",
  completed: "Завершен",
  cancelled: "Отменен",
  delivered: "Доставлен",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivering: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  delivered: "bg-gray-100 text-gray-800",
};

export function ArchivedOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();
  const [orders, setOrders] = useState<OrderOut[]>([]);
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
        // Получаем архивные заказы (завершенные или отмененные)
        const allOrders = await getUserOrders(accessToken);
        const archivedOrders = allOrders.filter(
          (order) => order.status === "completed" || order.status === "cancelled" || order.status === "delivered"
        );
        // Сортируем по дате создания (новые сначала)
        archivedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(archivedOrders);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1 className="text-3xl font-bold">История заказов</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Нет завершенных заказов</h2>
            <p className="text-gray-500 mb-6">
              История ваших заказов появится здесь после их завершения
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
                      <Package className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold">
                        Заказ #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status] || statusColors.completed
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.restaurant_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-700">
                      {order.total_amount} ₽
                    </p>
                  </div>
                </div>

                {order.delivery_address && (
                  <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>{order.delivery_address.street_address}</p>
                      <p>{order.delivery_address.city}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Состав заказа:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.dish_name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {item.price * item.quantity} ₽
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
