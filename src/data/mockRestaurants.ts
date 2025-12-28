export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image?: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "Pizza House",
    description: "Лучшая пицца в городе! Итальянская кухня с доставкой",
    address: "Москва, Тверская ул., 10",
    phone: "+7 (495) 123-45-67",
    rating: 4.8,
    deliveryTime: "30-45 мин",
    minOrder: 500,
  },
  {
    id: "rest2",
    name: "Sushi Master",
    description: "Свежие суши и роллы. Японская кухня премиум класса",
    address: "Москва, Арбат ул., 25",
    phone: "+7 (495) 234-56-78",
    rating: 4.9,
    deliveryTime: "25-40 мин",
    minOrder: 800,
  },
  {
    id: "rest3",
    name: "Italian Kitchen",
    description: "Аутентичная итальянская кухня. Паста, пицца, салаты",
    address: "Москва, Кузнецкий мост, 5",
    phone: "+7 (495) 345-67-89",
    rating: 4.7,
    deliveryTime: "35-50 мин",
    minOrder: 600,
  },
  {
    id: "rest4",
    name: "Грузинская кухня",
    description: "Традиционные грузинские блюда. Хачапури, шашлык, хинкали",
    address: "Москва, Большая Дмитровка, 15",
    phone: "+7 (495) 456-78-90",
    rating: 4.6,
    deliveryTime: "40-60 мин",
    minOrder: 700,
  },
  {
    id: "rest5",
    name: "Thai Food",
    description: "Острая тайская кухня. Пад Тай, Том Ям, карри",
    address: "Москва, Никольская ул., 8",
    phone: "+7 (495) 567-89-01",
    rating: 4.5,
    deliveryTime: "30-45 мин",
    minOrder: 650,
  },
  {
    id: "rest6",
    name: "Steak House",
    description: "Премиальные стейки и мясные блюда",
    address: "Москва, Тверской бульвар, 12",
    phone: "+7 (495) 678-90-12",
    rating: 4.9,
    deliveryTime: "45-60 мин",
    minOrder: 1200,
  },
];

