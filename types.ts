export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  images: string[];
  stock: number;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Chairman' | 'Admin' | 'Customer';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
  cancellationReason?: string;
  cancellationFeedback?: string;
}