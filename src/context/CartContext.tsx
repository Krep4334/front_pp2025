import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useMenuData } from "../hooks/useMenuData";
import {
  addToCart as addToCartApi,
  deleteCartItem as deleteCartItemApi,
  getCart as getCartApi,
  updateCartItem as updateCartItemApi,
} from "../api/order";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  cartItemId?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void> | void;
  removeFromCart: (id: string) => Promise<void> | void;
  updateQuantity: (id: string, quantity: number) => Promise<void> | void;
  clearCart: (options?: { skipServer?: boolean }) => Promise<void> | void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { accessToken } = useAuth();
  const { dishes } = useMenuData();
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const dishById = useMemo(() => {
    return new Map(dishes.map((dish) => [dish.id, dish]));
  }, [dishes]);

  const hydrateCartItems = (cartItems: { id: number; dish_id: number; quantity: number }[]) => {
    return cartItems.map((cartItem) => {
      const dish = dishById.get(String(cartItem.dish_id));
      return {
        id: String(cartItem.dish_id),
        name: dish?.name || `Блюдо #${cartItem.dish_id}`,
        price: dish?.price || 0,
        image: dish?.image,
        restaurantId: dish?.restaurantId || "0",
        restaurantName: dish?.restaurantName || "Ресторан",
        quantity: cartItem.quantity,
        cartItemId: cartItem.id,
      };
    });
  };

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    const syncCart = async () => {
      try {
        if (itemsRef.current.some((item) => !item.cartItemId)) {
          await Promise.all(
            itemsRef.current.map((item) => {
              const dishId = Number(item.id);
              if (Number.isNaN(dishId)) return Promise.resolve();
              return addToCartApi(dishId, item.quantity, accessToken);
            })
          );
        }

        const serverItems = await getCartApi(accessToken);
        if (!isMounted) return;
        setItems(hydrateCartItems(serverItems));
      } catch {
        if (!isMounted) return;
      }
    };

    syncCart();

    return () => {
      isMounted = false;
    };
  }, [accessToken, dishById]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    if (!accessToken) return;

    try {
      const dishId = Number(item.id);
      if (Number.isNaN(dishId)) return;
      const serverItem = await addToCartApi(dishId, 1, accessToken);
      setItems((prev) =>
        prev.map((i) =>
          i.id === String(serverItem.dish_id)
            ? { ...i, quantity: serverItem.quantity, cartItemId: serverItem.id }
            : i
        )
      );
    } catch {
      // best-effort for UI
    }
  };

  const removeFromCart = async (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (!accessToken || !target?.cartItemId) return;
    try {
      await deleteCartItemApi(target.cartItemId, accessToken);
    } catch {
      // ignore
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

    const target = items.find((i) => i.id === id);
    if (!accessToken || !target?.cartItemId) return;

    try {
      const serverItem = await updateCartItemApi(
        target.cartItemId,
        quantity,
        accessToken
      );
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: serverItem.quantity } : i
        )
      );
    } catch {
      // ignore
    }
  };

  const clearCart = async (options?: { skipServer?: boolean }) => {
    setItems([]);
    if (!accessToken || options?.skipServer) return;
    const deletions = items.map((item) =>
      item.cartItemId ? deleteCartItemApi(item.cartItemId, accessToken) : null
    );
    await Promise.allSettled(deletions);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


