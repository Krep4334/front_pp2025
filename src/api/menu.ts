import { apiConfig } from "./config";
import { getPlaceholderImage } from "../utils/imagePlaceholders";
import { Dish, Restaurant } from "../types";

interface RestaurantOut {
  id: number;
  name: string;
  description?: string | null;
  min_order_amount: number;
  delivery_fee: number;
  delivery_time_min: number;
  delivery_time_max: number;
  is_active: boolean;
}

interface CategoryOut {
  id: number;
  restaurant_id: number;
  name: string;
  display_order: number;
}

interface DishOut {
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

const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
};

const toUiRestaurant = (restaurant: RestaurantOut): Restaurant => ({
  id: String(restaurant.id),
  name: restaurant.name,
  description: restaurant.description || undefined,
  minOrder: Number(restaurant.min_order_amount),
  deliveryFee: Number(restaurant.delivery_fee),
  deliveryTime: `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} мин`,
  isActive: restaurant.is_active,
});

const toUiDish = (
  dish: DishOut,
  restaurantName: string,
  categoryName: string,
  index: number
): Dish => ({
  id: String(dish.id),
  name: dish.name,
  description: dish.description || undefined,
  price: Number(dish.price),
  image: dish.image_url || getPlaceholderImage(categoryName, index + 1),
  restaurantId: String(dish.restaurant_id),
  restaurantName,
  category: categoryName,
  isAvailable: dish.is_available,
});

export const loadMenuData = async (): Promise<{
  restaurants: Restaurant[];
  dishes: Dish[];
}> => {
  const restaurantsResponse = await apiFetch<RestaurantOut[]>(
    `${apiConfig.restaurant}/restaurants`
  );

  const restaurants = restaurantsResponse.map(toUiRestaurant);
  const restaurantNameById = new Map(
    restaurants.map((restaurant) => [restaurant.id, restaurant.name])
  );

  const dishes: Dish[] = [];

  await Promise.all(
    restaurantsResponse.map(async (restaurant) => {
      const [categories, restaurantDishes] = await Promise.all([
        apiFetch<CategoryOut[]>(
          `${apiConfig.restaurant}/restaurants/${restaurant.id}/categories`
        ),
        apiFetch<DishOut[]>(
          `${apiConfig.restaurant}/restaurants/${restaurant.id}/dishes`
        ),
      ]);

      const categoryById = new Map(
        categories.map((category) => [category.id, category.name])
      );

      restaurantDishes.forEach((dish, index) => {
        const categoryName =
          (dish.category_id && categoryById.get(dish.category_id)) ||
          "Без категории";
        const restaurantName = restaurantNameById.get(String(dish.restaurant_id)) || "";

        dishes.push(toUiDish(dish, restaurantName, categoryName, index));
      });
    })
  );

  return { restaurants, dishes };
};

