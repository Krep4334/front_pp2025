import { useLocation, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { CheckCircle } from "lucide-react";

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || `ORDER-${Date.now()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>
          <p className="text-gray-600 mb-2">
            Номер вашего заказа: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-500 mb-8">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              to="/customer"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Вернуться к меню
            </Link>
            <button
              onClick={() => navigate("/support")}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Связаться с поддержкой
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

