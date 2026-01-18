import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getProfile, UserProfile } from "../api/user";
import { User, Package, Clock, History, MapPin, Phone, Mail } from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken, userEmail } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/auth");
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userProfile = await getProfile(accessToken);
        setProfile(userProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, accessToken, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Загрузка профиля...</p>
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
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate("/customer")}
              className="text-orange-500 hover:text-orange-600"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Пользователь"
    : "Пользователь";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Профиль</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Информация о пользователе */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
              </div>

              <div className="space-y-3">
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email || userEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Навигация по заказам */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Мои заказы</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/profile/orders/active"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Активные заказы</h3>
                    <p className="text-sm text-gray-500">Текущие заказы в работе</p>
                  </div>
                </Link>

                <Link
                  to="/profile/orders/archived"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <History className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">История заказов</h3>
                    <p className="text-sm text-gray-500">Завершенные заказы</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Адреса доставки */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Адреса доставки</h2>
                <button className="text-sm text-orange-500 hover:text-orange-600">
                  Добавить адрес
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Адреса будут загружены позже</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
