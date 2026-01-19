import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Plus, Minus, ArrowLeft, Utensils } from "lucide-react";
import { useMenuData } from "../hooks/useMenuData";

export function DishPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { dishes, isLoading, error } = useMenuData();

  const dish = dishes.find((d) => d.id === id);
  const cartItem = dish ? items.find((item) => item.id === dish.id) : null;
  const quantity = cartItem?.quantity || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Загрузка блюда...</h2>
            <p className="text-gray-500">Пожалуйста, подождите</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Ошибка загрузки</h2>
            <p className="text-gray-500 mb-4">
              Не удалось получить данные о блюде. Проверьте настройки API.
            </p>
            <p className="text-sm text-gray-400">{error}</p>
            <Link
              to="/customer"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition mt-6"
            >
              Вернуться к меню
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Блюдо не найдено</h2>
            <p className="text-gray-500 mb-6">Извините, такое блюдо не существует</p>
            <Link
              to="/customer"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Вернуться к меню
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Похожие блюда (из той же категории или ресторана, исключая текущее)
  const similarDishes = dishes
    .filter(
      (d) =>
        d.id !== dish.id &&
        (d.category === dish.category || d.restaurantId === dish.restaurantId)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!dish) return;
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Изображение */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Информация */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <span className="inline-block bg-orange-500/90 text-white text-xs px-3 py-1 rounded-full mb-3">
                {dish.category}
              </span>
              <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
              <p className="text-gray-500 mb-4">{dish.restaurantName}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed mb-4 max-w-md">
                {dish.description}
              </p>
            </div>

            {/* Описание */}
            {dish.description && (
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                  <Utensils className="w-5 h-5" />
                  Описание
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {dish.description}
                </p>
              </div>
            )}

            {/* Цена и добавление в корзину */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-orange-500">
                  {dish.price} ₽
                </span>
              </div>
              <div className="mb-4">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold inline-flex items-center justify-center gap-2 shadow-md text-lg"
                  >
                    <Plus className="w-6 h-6" />
                    Добавить в корзину
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 inline-flex">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate("/auth");
                          return;
                        }
                        if (!dish) return;
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
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate("/auth");
                          return;
                        }
                        if (!dish) return;
                        updateQuantity(dish.id, quantity + 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white shadow-sm hover:bg-gray-900 transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Похожие блюда */}
        {similarDishes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Похожие блюда</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarDishes.map((similarDish) => (
                <Link
                  key={similarDish.id}
                  to={`/dish/${similarDish.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="relative">
                    <img
                      src={similarDish.image}
                      alt={similarDish.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      {similarDish.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {similarDish.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {similarDish.restaurantName}
                    </p>
                    <p className="text-orange-500 font-bold">
                      {similarDish.price} ₽
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

