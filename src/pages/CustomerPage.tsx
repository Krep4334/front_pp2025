import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Search, X, Store } from "lucide-react";
import { useMenuData } from "../hooks/useMenuData";

export function CustomerPage() {
  const { restaurants, isLoading, error } = useMenuData();
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация ресторанов
  const filteredRestaurants = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return restaurants.filter((restaurant) => {
      const name = restaurant.name.toLowerCase();
      const description = (restaurant.description || "").toLowerCase();
      return name.includes(search) || description.includes(search);
    });
  }, [restaurants, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Доставка еды в Москве
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Более 1000 ресторанов и кафе. Быстрая доставка за 30 минут
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти ресторан или блюдо"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Результаты поиска */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Загрузка меню...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Не удалось загрузить данные. Проверьте подключение к API.
            </p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Ничего не найдено
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
                className="mt-4 text-orange-500 hover:text-orange-600 text-sm"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Рестораны
                {searchQuery && ` (${filteredRestaurants.length})`}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}/menu`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition block flex flex-col h-full"
                >
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <Store className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {restaurant.description || "Описание не указано"}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1 mt-auto">
                      <div>Доставка: {restaurant.deliveryTime}</div>
                      <div>Мин. заказ: {restaurant.minOrder} ₽</div>
                      <div>Стоимость доставки: {restaurant.deliveryFee} ₽</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
