import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { CustomerPage } from "./pages/CustomerPage";
import { RestaurantPage } from "./pages/RestaurantPage";
import { SupportPage } from "./pages/SupportPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { DishPage } from "./pages/DishPage";

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
        <Route path="/" element={<Navigate to="/customer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
