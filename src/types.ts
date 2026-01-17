export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  minOrder: number;
  deliveryFee: number;
  deliveryTime: string;
  isActive: boolean;
  address?: string;
  phone?: string;
  rating?: number;
  image?: string;
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  category: string;
  isAvailable: boolean;
  ingredients?: string[];
  weight?: number;
  calories?: number;
}

