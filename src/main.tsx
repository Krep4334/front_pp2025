import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <OrdersProvider>
      <App />
    </OrdersProvider>
  </CartProvider>
);
  