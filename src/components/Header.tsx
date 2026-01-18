import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, ShoppingCart, HelpCircle, Code, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const isCustomerView = location.pathname === '/customer' || location.pathname === '/';
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const debugRoutes = [
    { path: "/customer", label: "Главная (Блюда)" },
    { path: "/cart", label: "Корзина" },
    { path: "/checkout", label: "Оформление заказа" },
    { path: "/order-success", label: "Заказ успешен" },
    { path: "/support", label: "Поддержка" },
    { path: "/restaurant", label: "Панель ресторана" },
  ];


  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/customer" className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">F</span>
              </div>
              <h1 className="font-bold text-xl">FoodExpress</h1>
            </div>
          </Link>

          {/* Location (for customer view) */}
          {isCustomerView && (
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>Москва, Тверская улица, 1</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Debug Menu */}
            <div className="relative">
                <button
                  onClick={() => setIsDebugOpen(!isDebugOpen)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 h-8 px-3"
                  title="Debug Navigation"
                >
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Debug</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isDebugOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDebugOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDebugOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">
                          Навигация
                        </div>
                        {debugRoutes.map((route) => (
                          <button
                            key={route.path}
                            onClick={() => {
                              navigate(route.path);
                              setIsDebugOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition ${
                                location.pathname === route.path
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-gray-700"
                              }`}
                          >
                            {route.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </div>
            {/* Cart (for customer view) */}
            {isCustomerView && (
              <Link to="/cart">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3 relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Корзина</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Профиль</span>
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Войти</span>
                </button>
              </Link>
            )}

            {/* Support Link */}
            <Link to="/support">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-8 rounded-md gap-1.5 px-3"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Поддержка</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
