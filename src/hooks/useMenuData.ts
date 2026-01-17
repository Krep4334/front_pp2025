import { useEffect, useState } from "react";
import { loadMenuData } from "../api/menu";
import { Dish, Restaurant } from "../types";

export const useMenuData = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async (isMountedRef?: { current: boolean }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadMenuData();
      if (isMountedRef && !isMountedRef.current) return;
      setRestaurants(data.restaurants);
      setDishes(data.dishes);
    } catch (err) {
      if (isMountedRef && !isMountedRef.current) return;
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
      setRestaurants([]);
      setDishes([]);
    } finally {
      if (!isMountedRef || isMountedRef.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const isMountedRef = { current: true };
    reload(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { restaurants, dishes, isLoading, error, reload };
};

