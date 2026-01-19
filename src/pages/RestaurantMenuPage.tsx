import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useMenuData } from "../hooks/useMenuData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";

export function RestaurantMenuPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, dishes, isLoading, error } = useMenuData();
  const { addToCart, updateQuantity, items } = useCart();
  const { isAuthenticated } = useAuth();

  const restaurant = useMemo(
    () => restaurants.find((item) => item.id === id),
    [restaurants, id]
  );

  const restaurantDishes = useMemo(() => {
    return dishes.filter((dish) => dish.restaurantId === id);
  }, [dishes, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-500">Загрузка меню...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Ресторан не найден</h2>
          <p className="text-gray-500 mb-6">
            {error || "Проверьте корректность ссылки."}
          </p>
          <button
            onClick={() => navigate("/customer")}
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Вернуться к списку ресторанов
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/customer")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад к ресторанам
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">
            {restaurant.description || "Описание не указано"}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Доставка: {restaurant.deliveryTime}</span>
            <span>Мин. заказ: {restaurant.minOrder} ₽</span>
            <span>Доставка: {restaurant.deliveryFee} ₽</span>
          </div>
        </div>

        {restaurantDishes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">Меню пока пустое</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurantDishes.map((dish) => (
              <Link
                key={dish.id}
                to={`/dish/${dish.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition block flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    {dish.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {dish.description || "Описание не указано"}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-orange-500 font-bold text-lg">
                      {dish.price} ₽
                    </span>
                    {(() => {
                      const currentItem = items.find((item) => item.id === dish.id);
                      const quantity = currentItem?.quantity || 0;

                      if (quantity === 0) {
                        return (
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (!isAuthenticated) {
                                navigate("/auth");
                                return;
                              }
                              addToCart({
                                id: dish.id,
                                name: dish.name,
                                price: dish.price,
                                image: dish.image,
                                restaurantId: dish.restaurantId,
                                restaurantName: dish.restaurantName,
                              });
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2 shrink-0 active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            Добавить
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-2 py-1">
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (!isAuthenticated) {
                                navigate("/auth");
                                return;
                              }
                              updateQuantity(dish.id, quantity - 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-black border border-gray-200 shadow-sm hover:bg-gray-50 transition active:scale-95"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[24px] text-center font-semibold text-black">
                            {quantity}
                          </span>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (!isAuthenticated) {
                                navigate("/auth");
                                return;
                              }
                              updateQuantity(dish.id, quantity + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white shadow-sm hover:bg-gray-900 transition active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

