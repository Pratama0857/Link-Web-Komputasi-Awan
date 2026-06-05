/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  posterUrl?: string;
  synopsis: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Popcorn' | 'Snacks' | 'Beverages' | 'Combos';
  price: number;
  description: string;
  imageUrl?: string;
  popular?: boolean;
  flavors?: string[];
  sizes?: string[];
}

export interface CartItem {
  id: string; // Unique cart item ID (combines product ID + selected flavor + selected size)
  product: Product;
  quantity: number;
  selectedFlavor?: string;
  selectedSize?: string;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  studioNumber: string;
  seatRow: string;
  seatNumber: string;
  movieTitle: string;
  items: {
    name: string;
    quantity: number;
    flavor?: string;
    size?: string;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: 'GoPay' | 'OVO' | 'Dana' | 'Virtual_Account';
  status: 'Received' | 'Preparing' | 'In_Transit' | 'Delivered';
  createdAt: string;
}

export interface AIChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedItems?: string[]; // IDs of products recommended by the AI
}

export interface CinemaUser {
  name: string;
  phone: string;
  tier: 'GUEST' | 'GOLD' | 'PLATINUM_VIP';
  memberId: string;
  points: number;
}
