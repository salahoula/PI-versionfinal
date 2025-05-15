import { Product } from '@/types/product';

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal clear sound with our premium wireless headphones. Featuring noise cancellation and 20-hour battery life.",
    price: 149.99,
    discountPercentage: 10,
    rating: 4.8,
    stock: 50,
    brand: "AudioTech",
    category: "Electronics",
    thumbnail: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    images: [
      "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    featured: true,
    tags: ["wireless", "audio", "premium"],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Smartwatch Pro",
    description: "Stay connected with our latest smartwatch. Track fitness, receive notifications, and more with a 5-day battery life.",
    price: 199.99,
    discountPercentage: 15,
    rating: 4.6,
    stock: 30,
    brand: "TechGear",
    category: "Electronics",
    thumbnail: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    images: [
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    featured: true,
    tags: ["smartwatch", "fitness", "tech"],
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2023-02-10T00:00:00Z"
  },
  {
    id: "3",
    name: "Designer Handbag",
    description: "Elegant designer handbag made with premium materials. Perfect for any occasion with its timeless design.",
    price: 299.99,
    discountPercentage: 0,
    rating: 4.9,
    stock: 15,
    brand: "LuxeStyle",
    category: "Fashion",
    thumbnail: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    images: [
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    featured: true,
    tags: ["handbag", "luxury", "accessory"],
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-03-05T00:00:00Z"
  },
  {
    id: "4",
    name: "Ultra HD Smart TV",
    description: "Transform your home entertainment with our 55-inch Ultra HD Smart TV. Featuring vibrant colors and smart connectivity.",
    price: 699.99,
    discountPercentage: 20,
    rating: 4.7,
    stock: 25,
    brand: "VisionPlus",
    category: "Electronics",
    thumbnail: "https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    images: [
      "https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/5240544/pexels-photo-5240544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    featured: true,
    tags: ["tv", "smart", "uhd"],
    createdAt: "2023-04-20T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z"
  }
];

export const categories = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "4",
    name: "Beauty",
    slug: "beauty",
    image: "https://images.pexels.com/photos/2253834/pexels-photo-2253834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "5",
    name: "Sports",
    slug: "sports",
    image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "6",
    name: "Books",
    slug: "books",
    image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];