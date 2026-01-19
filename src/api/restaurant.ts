import { apiConfig } from "./config";
import { apiFetch } from "./http";

export interface CategoryOut {
  id: number;
  restaurant_id: number;
  name: string;
  display_order: number;
}

export interface DishOut {
  id: number;
  restaurant_id: number;
  category_id?: number | null;
  name: string;
  description?: string | null;
  price: number;
  weight?: number | null;
  calories?: number | null;
  image_url?: string | null;
  is_available: boolean;
  is_recommended: boolean;
}

export interface RestaurantStats {
  total_orders: number;
  today_orders: number;
  average_check: number;
  monthly_active_customers: number;
  total_revenue: number;
  today_revenue: number;
}

export interface RestaurantOrderItemOut {
  dish_id: number;
  dish_name: string;
  dish_price: number;
  quantity: number;
  subtotal: number;
}

export interface RestaurantOrderOut {
  id: number;
  customer_id: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  items: RestaurantOrderItemOut[];
}

export const getCategories = (restaurantId: number) =>
  apiFetch<CategoryOut[]>(`${apiConfig.restaurant}/restaurants/${restaurantId}/categories`);

export const createCategory = (
  payload: { restaurant_id: number; name: string; display_order?: number },
  accessToken: string
) =>
  apiFetch<CategoryOut>(`${apiConfig.restaurant}/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, accessToken);

export const updateCategory = (
  categoryId: number,
  payload: { name?: string; display_order?: number },
  accessToken: string
) =>
  apiFetch<CategoryOut>(`${apiConfig.restaurant}/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, accessToken);

export const deleteCategory = (categoryId: number, accessToken: string) =>
  apiFetch<void>(`${apiConfig.restaurant}/categories/${categoryId}`, {
    method: "DELETE",
  }, accessToken);

export const getDishes = (restaurantId: number) =>
  apiFetch<DishOut[]>(`${apiConfig.restaurant}/restaurants/${restaurantId}/dishes`);

export const createDish = (payload: {
  restaurant_id: number;
  category_id?: number | null;
  name: string;
  description?: string | null;
  price: number;
  weight?: number | null;
  calories?: number | null;
  image_url?: string | null;
  is_available?: boolean;
  is_recommended?: boolean;
}, accessToken: string) =>
  apiFetch<DishOut>(`${apiConfig.restaurant}/dishes`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, accessToken);

export const updateDish = (
  dishId: number,
  payload: {
    category_id?: number | null;
    name?: string;
    description?: string | null;
    price?: number;
    weight?: number | null;
    calories?: number | null;
    image_url?: string | null;
    is_available?: boolean;
    is_recommended?: boolean;
  },
  accessToken: string
) =>
  apiFetch<DishOut>(`${apiConfig.restaurant}/dishes/${dishId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, accessToken);

export const deleteDish = (dishId: number, accessToken: string) =>
  apiFetch<void>(`${apiConfig.restaurant}/dishes/${dishId}`, {
    method: "DELETE",
  }, accessToken);

export const getRestaurantStats = (restaurantId: number, accessToken: string) =>
  apiFetch<RestaurantStats>(`${apiConfig.restaurant}/restaurants/${restaurantId}/stats`, undefined, accessToken);

export const getRestaurantOrders = (
  restaurantId: number,
  accessToken: string,
  params?: { status_filter?: string; archive?: boolean }
) => {
  const query = new URLSearchParams();
  if (params?.status_filter) query.set("status_filter", params.status_filter);
  if (typeof params?.archive === "boolean") query.set("archive", String(params.archive));
  const suffix = query.toString();
  const url = `${apiConfig.restaurant}/restaurants/${restaurantId}/orders${suffix ? `?${suffix}` : ""}`;
  return apiFetch<RestaurantOrderOut[]>(url, undefined, accessToken);
};

