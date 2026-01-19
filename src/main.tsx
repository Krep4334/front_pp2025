import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
  <CartProvider>
    <OrdersProvider>
      <App />
    </OrdersProvider>
  </CartProvider>
  </AuthProvider>
);
  