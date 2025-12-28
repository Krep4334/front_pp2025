import { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { mockDishes } from "../data/mockDishes";
import { mockRestaurants } from "../data/mockRestaurants";
import { useOrders } from "../context/OrdersContext";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Package,
} from "lucide-react";

export function RestaurantPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(mockRestaurants[0]);
  const [activeTab, setActiveTab] = useState<"stats" | "menu" | "orders">("stats");
  const { getOrdersByRestaurant, updateOrderStatus } = useOrders();

  // Статистика для выбранного ресторана
  const restaurantDishes = mockDishes.filter(
    (dish) => dish.restaurantId === selectedRestaurant.id
  );

  // Получаем реальные заказы для выбранного ресторана
  const restaurantOrders = useMemo(() => {
    return getOrdersByRestaurant(selectedRestaurant.id);
  }, [selectedRestaurant.id, getOrdersByRestaurant]);

  // Мок статистика
  const stats = {
    totalOrders: 1247,
    todayOrders: 23,
    totalRevenue: 1250000,
    todayRevenue: 45000,
    averageOrder: 3500,
    rating: selectedRestaurant.rating,
    activeCustomers: 342,
    popularDishes: restaurantDishes.slice(0, 3),
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivering":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "preparing":
        return "Готовится";
      case "ready":
        return "Готов";
      case "delivering":
        return "Доставляется";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Выбор ресторана */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите ресторан
          </label>
          <select
            value={selectedRestaurant.id}
            onChange={(e) => {
              const restaurant = mockRestaurants.find((r) => r.id === e.target.value);
              if (restaurant) setSelectedRestaurant(restaurant);
            }}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {mockRestaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Информация о ресторане */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h1>
              <p className="text-gray-600 mb-2">{selectedRestaurant.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{selectedRestaurant.address}</span>
                <span>•</span>
                <span>{selectedRestaurant.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {selectedRestaurant.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "stats"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Статистика
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "menu"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Меню ({restaurantDishes.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium transition ${
              activeTab === "orders"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Заказы ({restaurantOrders.length})
          </button>
        </div>

        {/* Контент табов */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Карточки статистики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Всего заказов</span>
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-sm text-green-600 mt-1">
                  +{stats.todayOrders} сегодня
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Выручка</span>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.totalRevenue.toLocaleString()} ₽
                </div>
                <div className="text-sm text-green-600 mt-1">
                  +{stats.todayRevenue.toLocaleString()} ₽ сегодня
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Средний чек</span>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{stats.averageOrder} ₽</div>
                <div className="text-sm text-gray-500 mt-1">За все время</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Активных клиентов</span>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{stats.activeCustomers}</div>
                <div className="text-sm text-gray-500 mt-1">За месяц</div>
              </div>
            </div>

            {/* Популярные блюда */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Популярные блюда</h2>
              <div className="space-y-3">
                {stats.popularDishes.map((dish, index) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{dish.name}</p>
                        <p className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 200 + 50)} заказов
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-500 font-semibold">
                      {dish.price} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Меню ресторана</h2>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить блюдо
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurantDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      {dish.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {dish.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 font-bold">
                        {dish.price} ₽
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Активные заказы</h2>
            {restaurantOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Нет активных заказов</p>
                <p className="text-sm text-gray-400 mt-2">
                  Оформите заказ на главной странице, и он появится здесь
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurantOrders.map((order) => {
                  // Форматируем данные заказа
                  const orderItems = order.items.map((item) => item.name);
                  const customerName = order.customer.name;
                  const orderAddress = order.customer.address;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-lg">{order.id}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{customerName}</span> • {order.time}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-orange-500">
                          {order.total} ₽
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Блюда:</p>
                        <p className="text-sm">{Array.isArray(orderItems) ? orderItems.join(", ") : orderItems}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{orderAddress}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Начать готовить
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Готово
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivering")}
                            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                          >
                            Передать курьеру
                          </button>
                        )}
                        {order.status === "delivering" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "completed")}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                          >
                            Завершить
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
