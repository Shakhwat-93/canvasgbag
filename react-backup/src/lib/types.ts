export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  colorCode?: string;
  image: string;
  price: number;
  inStock: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  quote: string;
  location: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  story: string;
  benefits: string[];
  specs: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  isBestSeller?: boolean;
  badge?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  variantId: string;
  variantName: string;
  quantity: number;
};

export type CheckoutForm = {
  name: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  note?: string;
};

export type OrderStatus = "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  status: OrderStatus;
  paymentMethod: "cod";
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  items: CartItem[];
  createdAt: string;
};
