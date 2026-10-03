export type BranchSlug = "wuse" | "garki";

export interface BranchInfo {
  slug: BranchSlug;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categorySlug: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  tags?: string[];
}

export interface Buyer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  branch: BranchSlug;
  items: OrderItem[];
  buyer: Buyer;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type InquiryStatus = "open" | "contacted" | "resolved";

export interface CrossBranchInquiry {
  id: string;
  productSlug: string;
  productName: string;
  quantity: number;
  fromBranch: BranchSlug;
  toBranch: BranchSlug;
  buyer: Buyer;
  note?: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface StoreData {
  branch: BranchInfo;
  categories: Category[];
  products: Product[];
  orders: Order[];
  inquiries: CrossBranchInquiry[];
}

export interface StockCheckResponse {
  available: boolean;
  branch: BranchSlug;
  branchName: string;
  stock: number;
  product?: {
    slug: string;
    name: string;
    price: number;
    image: string;
  };
}
