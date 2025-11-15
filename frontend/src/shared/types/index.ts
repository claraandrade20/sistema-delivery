// Tipos do Sistema de Delivery

export type UserRole = 'client' | 'employee' | 'admin';

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export type PaymentMethod = 'credit_card' | 'pix' | 'meal_voucher' | 'cash';

export type CouponType = 'percentage' | 'fixed';

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
}

export interface ProductVariation {
  id: string;
  name: string; // Ex: "Pequena", "Média", "Grande"
  price: number;
}

export interface ProductAddon {
  id: string;
  name: string; // Ex: "Borda recheada", "Bacon extra"
  price: number;
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
}

// ========== Cart Types ==========

export interface CartItem {
  productId: string;
  product: Product;
  variationId: string;
  variation: ProductVariation;
  addons: ProductAddon[];
  quantity: number;
  subtotal: number;
}

// ========== Order Types ==========

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
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
  updatedAt: string;
  estimatedDeliveryTime?: string;
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
