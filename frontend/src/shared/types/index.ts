// Tipos do Sistema de Delivery

export type UserRole = 'client' | 'employee' | 'admin';

export type OrderStatus = 
  | 'received' 
  | 'preparing' 
  | 'on_the_way' 
  | 'delivered' 
  | 'cancelled'
  | 'pending'
  | 'confirmed';

export type PaymentMethod = 'credit_card' | 'pix' | 'meal_voucher' | 'cash';

export type CouponType = 'percentage' | 'fixed';

// ========== Validation Types ==========

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ========== User Types ==========

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  restaurantId?: string; // Para funcionários
  lastLogin?: string;
  avatar?: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  label?: string; // "Casa", "Trabalho", etc.
  createdAt?: string;
  updatedAt?: string;
}

// ========== Product Types ==========

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  id: string;
  name: string; // Ex: "Pequena", "Média", "Grande"
  price: number;
  stock?: number;
  sku?: string;
}

export interface ProductAddon {
  id: string;
  name: string; // Ex: "Borda recheada", "Bacon extra"
  price: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  restaurantId: string;
  variations: ProductVariation[];
  addons?: ProductAddon[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewsCount?: number;
  preparationTime?: number; // em minutos
  createdAt?: string;
  updatedAt?: string;
  minOrder?: number;
  maxOrder?: number;
}

// ========== Cart Types ==========

export interface OrderItem {
  productId: string;
  product?: Product;
  productName?: string;
  variationId: string;
  variation?: ProductVariation;
  variationName?: string;
  addons?: ProductAddon[];
  quantity: number;
  subtotal: number;
}

export interface CartItem extends OrderItem {
  product: Product;
  variation: ProductVariation;
}

// ========== Order Types ==========

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  restaurantId: string;
  restaurantName?: string;
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  couponCode?: string;
  observations?: string;
  createdAt: string;
  updatedAt?: string;
  estimatedDeliveryTime?: string;
  deliveryPersonId?: string;
  rating?: number;
  review?: string;
}

// ========== Restaurant Types ==========

export interface BusinessHours {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc.
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: string;
  email: string;
  businessHours: BusinessHours[];
  isActive: boolean;
  rating?: number;
  minimumOrder?: number;
  deliveryFee: number;
  estimatedDeliveryTime: string; // Ex: "30-45 min"
  createdAt?: string;
  updatedAt?: string;
  categories?: Category[];
}

// ========== Coupon Types ==========

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // Percentual ou valor fixo
  minOrderValue: number;
  maxDiscount?: number; // Para cupons percentuais
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  restaurantId?: string; // Se for específico de um restaurante
  createdAt?: string;
}

// ========== Promotion Types ==========

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  restaurantId: string;
  productId?: string;
  discountPercentage?: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt?: string;
  updatedAt?: string;
}

// ========== Stock Types ==========

export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string; // Ex: "unidade", "kg", "litro"
  minQuantity: number; // Estoque mínimo
  lastUpdated: string;
  restaurantId: string;
  warnings?: string[];
}

// ========== Analytics Types ==========

export interface SalesReport {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  ordersByStatus: Record<OrderStatus, number>;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  activeCustomers: number;
  topSellingProducts: {
    id: string;
    name: string;
    image: string;
    salesCount: number;
  }[];
  recentOrders: Order[];
}

// ========== Response Types ==========

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
