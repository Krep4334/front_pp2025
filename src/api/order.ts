import { apiConfig } from "./config";
import { apiFetch } from "./http";

export interface CartItemOut {
  id: number;
  dish_id: number;
  quantity: number;
}

export const getCart = (accessToken: string) =>
  apiFetch<CartItemOut[]>(`${apiConfig.order}/cart`, undefined, accessToken);

export const addToCart = (dishId: number, quantity: number, accessToken: string) =>
  apiFetch<CartItemOut>(`${apiConfig.order}/cart/add`, {
    method: "POST",
    body: JSON.stringify({ dish_id: dishId, quantity }),
  }, accessToken);

export const updateCartItem = (cartItemId: number, quantity: number, accessToken: string) =>
  apiFetch<CartItemOut>(`${apiConfig.order}/cart/item/${cartItemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  }, accessToken);

export const deleteCartItem = (cartItemId: number, accessToken: string) =>
  apiFetch<void>(`${apiConfig.order}/cart/item/${cartItemId}`, {
    method: "DELETE",
  }, accessToken);

export interface CheckoutOut {
  id: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
}

export const checkout = (
  restaurantId: number,
  deliveryAddressId: number | undefined,
  accessToken: string
) =>
  apiFetch<CheckoutOut>(`${apiConfig.order}/checkout`, {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantId,
      delivery_address_id: deliveryAddressId ?? null,
    }),
  }, accessToken);

export const updateOrderStatus = (orderId: number, status: string, accessToken: string) =>
  apiFetch<{ order_id: number; new_status: string }>(
    `${apiConfig.order}/orders/${orderId}/status`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    },
    accessToken
  );

export interface OrderItemOut {
  id: number;
  dish_id: number;
  dish_name: string;
  quantity: number;
  price: number;
}

export interface OrderOut {
  id: number;
  restaurant_id: number;
  restaurant_name: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
  items: OrderItemOut[];
  delivery_address?: {
    street_address: string;
    city: string;
    postal_code?: string;
  };
}

export const getUserOrders = (accessToken: string, params?: { status?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.status) {
    queryParams.append("status", params.status);
  }
  const query = queryParams.toString();
  const url = `${apiConfig.order}/orders${query ? `?${query}` : ""}`;
  return apiFetch<OrderOut[]>(url, undefined, accessToken);
};

export const getOrder = (orderId: number, accessToken: string) =>
  apiFetch<OrderOut>(`${apiConfig.order}/orders/${orderId}`, undefined, accessToken);
