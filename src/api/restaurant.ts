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
  image_url?: string | null;
  is_available: boolean;
  is_recommended: boolean;
}

export const getCategories = (restaurantId: number) =>
  apiFetch<CategoryOut[]>(`${apiConfig.restaurant}/restaurants/${restaurantId}/categories`);

export const createCategory = (payload: { restaurant_id: number; name: string; display_order?: number }) =>
  apiFetch<CategoryOut>(`${apiConfig.restaurant}/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCategory = (categoryId: number, payload: { name?: string; display_order?: number }) =>
  apiFetch<CategoryOut>(`${apiConfig.restaurant}/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteCategory = (categoryId: number) =>
  apiFetch<void>(`${apiConfig.restaurant}/categories/${categoryId}`, {
    method: "DELETE",
  });

export const getDishes = (restaurantId: number) =>
  apiFetch<DishOut[]>(`${apiConfig.restaurant}/restaurants/${restaurantId}/dishes`);

export const createDish = (payload: {
  restaurant_id: number;
  category_id?: number | null;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  is_available?: boolean;
  is_recommended?: boolean;
}) =>
  apiFetch<DishOut>(`${apiConfig.restaurant}/dishes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateDish = (
  dishId: number,
  payload: {
    name?: string;
    description?: string | null;
    price?: number;
    image_url?: string | null;
    is_available?: boolean;
    is_recommended?: boolean;
  }
) =>
  apiFetch<DishOut>(`${apiConfig.restaurant}/dishes/${dishId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteDish = (dishId: number) =>
  apiFetch<void>(`${apiConfig.restaurant}/dishes/${dishId}`, {
    method: "DELETE",
  });

