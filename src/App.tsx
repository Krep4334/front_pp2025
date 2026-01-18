import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { CustomerPage } from "./pages/CustomerPage";
import { RestaurantPage } from "./pages/RestaurantPage";
import { SupportPage } from "./pages/SupportPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { DishPage } from "./pages/DishPage";
import { AuthPage } from "./pages/AuthPage";
import { RestaurantMenuPage } from "./pages/RestaurantMenuPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ActiveOrdersPage } from "./pages/ActiveOrdersPage";
import { ArchivedOrdersPage } from "./pages/ArchivedOrdersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/restaurant/:id/menu" element={<RestaurantMenuPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/orders/active" element={<ActiveOrdersPage />} />
        <Route path="/profile/orders/archived" element={<ArchivedOrdersPage />} />
        <Route path="/" element={<Navigate to="/customer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
