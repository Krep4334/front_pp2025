import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { MapPin, Phone, User, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createAddress } from "../api/user";
import { checkout as checkoutApi } from "../api/order";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { isAuthenticated, accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "card",
    comment: "",
  });

  const parseAddress = (address: string) => {
    const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
      return { city: parts[0], street: parts.slice(1).join(", ") };
    }
    return { city: "Не указан", street: address.trim() };
  };

  const mapStatusFromApi = (status: string) => {
    if (status === "delivered") return "completed";
    return status;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) return;
    if (!isAuthenticated || !accessToken) {
      navigate("/auth");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    // Определяем ресторан из первого блюда (все блюда должны быть из одного ресторана)
    const restaurantId = items[0].restaurantId;
    const restaurantName = items[0].restaurantName;

    try {
      const addressParts = parseAddress(formData.address);
      const address = await createAddress(
        {
          title: "Доставка",
          city: addressParts.city,
          street_address: addressParts.street,
          is_default: true,
        },
        accessToken
      );

      const checkoutResult = await checkoutApi(
        Number(restaurantId),
        address.id,
        accessToken
      );

      const order = addOrder({
        id: String(checkoutResult.id),
        status: mapStatusFromApi(checkoutResult.status) as any,
        restaurantId,
        restaurantName,
        items: items,
        total: checkoutResult.total_amount,
        customer: formData,
      });

      console.log("Заказ оформлен:", order);
      await clearCart({ skipServer: true });
      navigate("/order-success", { state: { orderId: order.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оформления заказа");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Требуется вход</h2>
            <p className="text-gray-500 mb-6">
              Войдите, чтобы оформить заказ
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Перейти к входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
            <p className="text-gray-500 mb-6">
              Добавьте блюда, чтобы оформить заказ
            </p>
            <button
              onClick={() => navigate("/customer")}
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Перейти к блюдам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Форма */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Данные для доставки</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User className="w-4 h-4" />
                  Имя
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Phone className="w-4 h-4" />
                  Телефон
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4" />
                  Адрес доставки
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Москва, Тверская улица, 1, кв. 10"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <CreditCard className="w-4 h-4" />
                  Способ оплаты
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="card">Карта онлайн</option>
                  <option value="cash">Наличными при получении</option>
                  <option value="card_courier">Картой курьеру</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Комментарий к заказу
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Дополнительные пожелания..."
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
              >
                {isSubmitting ? "Оформляем..." : "Оформить заказ"}
              </button>
            </form>
          </div>

          {/* Итоги заказа */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price} ₽
                    </p>
                  </div>
                  <p className="font-semibold">
                    {item.price * item.quantity} ₽
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span className="text-orange-500">{getTotalPrice()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

