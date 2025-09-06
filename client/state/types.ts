export type ID = string;

export type Category =
  | "Fashion"
  | "Beauty"
  | "Accessories"
  | "Electronics"
  | "Smart Devices"
  | "Home"
  | "Furniture"
  | "Decor"
  | "Kitchen"
  | "Books"
  | "Media"
  | "Educational"
  | "Toys"
  | "Sports"
  | "Sports Gear"
  | "Outdoor"
  | "Outdoor Equipment"
  | "Fitness"
  | "Other";

export interface UserProfile {
  id: ID;
  email: string;
  passwordHash: string; // stored locally only for prototype
  username: string;
  bio?: string;
  ecoScore: number; // 0-100
  trustBadges: string[]; // e.g., Verified Seller, Fast Shipper
  createdAt: number;
}

export interface Product {
  id: ID;
  sellerId: ID;
  title: string;
  description: string;
  category: Category;
  price: number; // cents
  imageDataUrl?: string; // base64 data url
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  id: ID;
  productId: ID;
  quantity: number;
  addedAt: number;
}

export interface PurchaseItem {
  id: ID;
  productId: ID;
  purchasedAt: number;
  priceAtPurchase: number; // cents
}
