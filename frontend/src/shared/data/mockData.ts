import type {
  User,
  Address,
  Restaurant,
  Category,
  Product,
  Order,
  Coupon,
  Promotion,
  BusinessHours,
  DashboardStats,
} from '../types';

// ========== Users ==========

export const mockUsers: User[] = [
  {
    id: 'client-1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    role: 'client',
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true,
  },
  {
    id: 'client-2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 91234-5678',
    role: 'client',
    createdAt: '2024-02-20T14:20:00Z',
    isActive: true,
  },
  {
    id: 'employee-1',
    name: 'Carlos Souza',
    email: 'carlos@restaurant.com',
    phone: '(11) 99999-8888',
    role: 'employee',
    createdAt: '2023-11-10T09:00:00Z',
    isActive: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'employee-2',
    name: 'Ana Lima',
    email: 'ana@restaurant.com',
    phone: '(11) 88888-7777',
    role: 'employee',
    createdAt: '2023-12-05T08:30:00Z',
    isActive: true,
    restaurantId: 'rest-1',
  },
  {
    id: 'admin-1',
    name: 'Roberto Admin',
    email: 'admin@deliverysystem.com',
    phone: '(11) 77777-6666',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true,
  },
];

// ========== Addresses ==========

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'client-1',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Jardim Paulista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01452-000',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'client-1',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isDefault: false,
  },
  {
    id: 'addr-3',
    userId: 'client-2',
    street: 'Rua Augusta',
    number: '500',
    complement: 'Casa',
    neighborhood: 'Consolação',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01305-000',
    isDefault: true,
  },
];

// ========== Restaurants ==========

const defaultBusinessHours: BusinessHours[] = [
  { dayOfWeek: 0, isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { dayOfWeek: 1, isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { dayOfWeek: 2, isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { dayOfWeek: 3, isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { dayOfWeek: 4, isOpen: true, openTime: '11:00', closeTime: '23:00' },
  { dayOfWeek: 5, isOpen: true, openTime: '11:00', closeTime: '00:00' },
  { dayOfWeek: 6, isOpen: true, openTime: '11:00', closeTime: '00:00' },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Pizzaria Bella Napoli',
    description: 'As melhores pizzas artesanais da cidade',
    image: 'https://images.unsplash.com/photo-1613274554329-70f997f5789f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzYzMDI3NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    address: 'Rua Vergueiro, 2000 - Vila Mariana, São Paulo - SP',
    phone: '(11) 3456-7890',
    email: 'contato@bellanapoli.com',
    businessHours: defaultBusinessHours,
    isActive: true,
    rating: 4.8,
    minimumOrder: 25.0,
    deliveryFee: 8.9,
    estimatedDeliveryTime: '30-45 min',
  },
  {
    id: 'rest-2',
    name: 'Burger House Premium',
    description: 'Hambúrgueres gourmet irresistíveis',
    image: 'https://images.unsplash.com/photo-1613274554329-70f997f5789f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzYzMDI3NjM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    address: 'Av. Faria Lima, 3000 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 2345-6789',
    email: 'contato@burgerhouse.com',
    businessHours: defaultBusinessHours,
    isActive: true,
    rating: 4.6,
    minimumOrder: 30.0,
    deliveryFee: 10.0,
    estimatedDeliveryTime: '25-40 min',
  },
];

// ========== Categories ==========

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Pizzas',
    description: 'Pizzas artesanais e tradicionais',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 1,
    restaurantId: 'rest-1',
  },
  {
    id: 'cat-2',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e cervejas',
    image: 'https://images.unsplash.com/photo-1732029543356-44fadaeeca51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwZHJpbmslMjBiZXZlcmFnZXxlbnwxfHx8fDE3NjMwNzE3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 2,
    restaurantId: 'rest-1',
  },
  {
    id: 'cat-3',
    name: 'Sobremesas',
    description: 'Doces e sobremesas deliciosas',
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NjI5NjI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 3,
    restaurantId: 'rest-1',
  },
  {
    id: 'cat-4',
    name: 'Massas',
    description: 'Massas frescas e tradicionais',
    image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2MzA0NTQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 4,
    restaurantId: 'rest-1',
  },
  {
    id: 'cat-5',
    name: 'Saladas',
    description: 'Saladas frescas e saudáveis',
    image: 'https://images.unsplash.com/photo-1692194741267-3df1119973ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc2MzAyMTYxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 5,
    restaurantId: 'rest-1',
  },
  {
    id: 'cat-6',
    name: 'Hambúrgueres',
    description: 'Burgers artesanais e gourmet',
    image: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NjMwMTUwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isActive: true,
    order: 6,
    restaurantId: 'rest-2',
  },
];

// ========== Products ==========

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-1',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-1-1', name: 'Pequena', price: 29.9 },
      { id: 'var-1-2', name: 'Média', price: 39.9 },
      { id: 'var-1-3', name: 'Grande', price: 49.9 },
    ],
    addons: [
      { id: 'addon-1', name: 'Borda recheada', price: 8.0 },
      { id: 'addon-2', name: 'Bacon extra', price: 5.0 },
      { id: 'addon-3', name: 'Azeitonas', price: 3.0 },
    ],
    stockQuantity: 50,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 234,
    preparationTime: 30,
  },
  {
    id: 'prod-2',
    name: 'Pizza Calabresa',
    description: 'Calabresa, cebola, mussarela e orégano',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-1',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-2-1', name: 'Pequena', price: 32.9 },
      { id: 'var-2-2', name: 'Média', price: 42.9 },
      { id: 'var-2-3', name: 'Grande', price: 52.9 },
    ],
    addons: [
      { id: 'addon-1', name: 'Borda recheada', price: 8.0 },
      { id: 'addon-2', name: 'Bacon extra', price: 5.0 },
    ],
    stockQuantity: 45,
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewsCount: 189,
    preparationTime: 30,
  },
  {
    id: 'prod-3',
    name: 'Pizza Quatro Queijos',
    description: 'Mussarela, provolone, gorgonzola e parmesão',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-1',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-3-1', name: 'Pequena', price: 35.9 },
      { id: 'var-3-2', name: 'Média', price: 45.9 },
      { id: 'var-3-3', name: 'Grande', price: 55.9 },
    ],
    addons: [
      { id: 'addon-1', name: 'Borda recheada', price: 8.0 },
    ],
    stockQuantity: 40,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 156,
    preparationTime: 30,
  },
  {
    id: 'prod-4',
    name: 'Coca-Cola 2L',
    description: 'Refrigerante Coca-Cola 2 litros',
    image: 'https://images.unsplash.com/photo-1732029543356-44fadaeeca51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwZHJpbmslMjBiZXZlcmFnZXxlbnwxfHx8fDE3NjMwNzE3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-2',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-4-1', name: 'Unidade', price: 12.9 },
    ],
    stockQuantity: 100,
    isActive: true,
    isFeatured: false,
    rating: 5.0,
    reviewsCount: 89,
  },
  {
    id: 'prod-5',
    name: 'Guaraná Antarctica 2L',
    description: 'Refrigerante Guaraná Antarctica 2 litros',
    image: 'https://images.unsplash.com/photo-1732029543356-44fadaeeca51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwZHJpbmslMjBiZXZlcmFnZXxlbnwxfHx8fDE3NjMwNzE3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-2',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-5-1', name: 'Unidade', price: 11.9 },
    ],
    stockQuantity: 80,
    isActive: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 67,
  },
  {
    id: 'prod-6',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate quente com sorvete',
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NjI5NjI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-3',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-6-1', name: 'Unidade', price: 18.9 },
    ],
    stockQuantity: 30,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 112,
    preparationTime: 15,
  },
  {
    id: 'prod-7',
    name: 'Espaguete à Carbonara',
    description: 'Massa fresca com bacon, ovos e parmesão',
    image: 'https://images.unsplash.com/photo-1749169337822-d875fd6f4c9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2MzA0NTQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-4',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-7-1', name: 'Porção Individual', price: 32.9 },
      { id: 'var-7-2', name: 'Porção para 2', price: 54.9 },
    ],
    stockQuantity: 35,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 145,
    preparationTime: 25,
  },
  {
    id: 'prod-8',
    name: 'Salada Caesar',
    description: 'Alface romana, frango grelhado, croutons e molho caesar',
    image: 'https://images.unsplash.com/photo-1692194741267-3df1119973ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGhlYWx0aHklMjBmb29kfGVufDF8fHx8MTc2MzAyMTYxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-5',
    restaurantId: 'rest-1',
    variations: [
      { id: 'var-8-1', name: 'Individual', price: 24.9 },
    ],
    stockQuantity: 25,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewsCount: 78,
    preparationTime: 15,
  },
  {
    id: 'prod-9',
    name: 'X-Bacon Gourmet',
    description: 'Hambúrguer artesanal, bacon, queijo cheddar, alface e tomate',
    image: 'https://images.unsplash.com/photo-1627378378955-a3f4e406c5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBnb3VybWV0JTIwZm9vZHxlbnwxfHx8fDE3NjMwMTUwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    categoryId: 'cat-6',
    restaurantId: 'rest-2',
    variations: [
      { id: 'var-9-1', name: 'Individual', price: 34.9 },
      { id: 'var-9-2', name: 'Com Fritas', price: 42.9 },
    ],
    addons: [
      { id: 'addon-4', name: 'Bacon extra', price: 6.0 },
      { id: 'addon-5', name: 'Queijo extra', price: 5.0 },
      { id: 'addon-6', name: 'Ovo', price: 3.0 },
    ],
    stockQuantity: 40,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 267,
    preparationTime: 20,
  },
];

// ========== Promotions ==========

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: '50% OFF em Pizzas às Terças',
    description: 'Todas as pizzas com 50% de desconto às terças-feiras',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    restaurantId: 'rest-1',
    discountPercentage: 50,
    isActive: true,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
  },
  {
    id: 'promo-2',
    title: 'Combo Família',
    description: '2 Pizzas Grandes + 2L Refri por R$ 89,90',
    image: 'https://images.unsplash.com/photo-1677030002034-e1d081abfb97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwaXRhbGlhbnxlbnwxfHx8fDE3NjMwNzE3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    restaurantId: 'rest-1',
    isActive: true,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
  },
  {
    id: 'promo-3',
    title: 'Sobremesa Grátis',
    description: 'Na compra de qualquer combo, ganhe uma sobremesa',
    image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NjI5NjI2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    restaurantId: 'rest-1',
    isActive: true,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
  },
];

// ========== Coupons ==========

export const mockCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'PRIMEIRACOMPRA',
    type: 'percentage',
    value: 20,
    minOrderValue: 30.0,
    maxDiscount: 15.0,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    isActive: true,
    usageLimit: 1000,
    usageCount: 234,
  },
  {
    id: 'coup-2',
    code: 'FRETEGRATIS',
    type: 'fixed',
    value: 8.9,
    minOrderValue: 50.0,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    isActive: true,
    usageLimit: 500,
    usageCount: 178,
  },
  {
    id: 'coup-3',
    code: 'PIZZA10',
    type: 'fixed',
    value: 10.0,
    minOrderValue: 40.0,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-03-31T23:59:59Z',
    isActive: true,
    restaurantId: 'rest-1',
    usageCount: 89,
  },
];

// ========== Orders ==========

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customerId: 'client-1',
    customerName: 'João Silva',
    customerPhone: '(11) 98765-4321',
    restaurantId: 'rest-1',
    restaurantName: 'Pizzaria Bella Napoli',
    items: [
      {
        productId: 'prod-1',
        product: mockProducts[0],
        variationId: 'var-1-3',
        variation: { id: 'var-1-3', name: 'Grande', price: 49.9 },
        addons: [{ id: 'addon-1', name: 'Borda recheada', price: 8.0 }],
        quantity: 1,
        subtotal: 57.9,
      },
      {
        productId: 'prod-4',
        product: mockProducts[3],
        variationId: 'var-4-1',
        variation: { id: 'var-4-1', name: 'Unidade', price: 12.9 },
        addons: [],
        quantity: 1,
        subtotal: 12.9,
      },
    ],
    deliveryAddress: mockAddresses[0],
    paymentMethod: 'pix',
    subtotal: 70.8,
    deliveryFee: 8.9,
    discount: 0,
    total: 79.7,
    status: 'delivered',
    createdAt: '2025-11-10T18:30:00Z',
    updatedAt: '2025-11-10T19:45:00Z',
    estimatedDeliveryTime: '19:15',
  },
  {
    id: 'order-2',
    customerId: 'client-1',
    customerName: 'João Silva',
    customerPhone: '(11) 98765-4321',
    restaurantId: 'rest-1',
    restaurantName: 'Pizzaria Bella Napoli',
    items: [
      {
        productId: 'prod-2',
        product: mockProducts[1],
        variationId: 'var-2-2',
        variation: { id: 'var-2-2', name: 'Média', price: 42.9 },
        addons: [],
        quantity: 2,
        subtotal: 85.8,
      },
    ],
    deliveryAddress: mockAddresses[0],
    paymentMethod: 'credit_card',
    subtotal: 85.8,
    deliveryFee: 8.9,
    discount: 0,
    total: 94.7,
    status: 'on_the_way',
    createdAt: '2025-11-13T19:00:00Z',
    updatedAt: '2025-11-13T19:30:00Z',
    estimatedDeliveryTime: '20:00',
  },
  {
    id: 'order-3',
    customerId: 'client-2',
    customerName: 'Maria Santos',
    customerPhone: '(11) 91234-5678',
    restaurantId: 'rest-1',
    restaurantName: 'Pizzaria Bella Napoli',
    items: [
      {
        productId: 'prod-7',
        product: mockProducts[6],
        variationId: 'var-7-2',
        variation: { id: 'var-7-2', name: 'Porção para 2', price: 54.9 },
        addons: [],
        quantity: 1,
        subtotal: 54.9,
      },
      {
        productId: 'prod-6',
        product: mockProducts[5],
        variationId: 'var-6-1',
        variation: { id: 'var-6-1', name: 'Unidade', price: 18.9 },
        addons: [],
        quantity: 2,
        subtotal: 37.8,
      },
    ],
    deliveryAddress: mockAddresses[2],
    paymentMethod: 'meal_voucher',
    subtotal: 92.7,
    deliveryFee: 8.9,
    discount: 14.16,
    total: 87.44,
    status: 'preparing',
    couponCode: 'PRIMEIRACOMPRA',
    createdAt: '2025-11-13T19:15:00Z',
    updatedAt: '2025-11-13T19:20:00Z',
    estimatedDeliveryTime: '20:15',
  },
];

// ========== Dashboard Stats ==========

export const mockDashboardStats: DashboardStats = {
  todayOrders: 45,
  todayRevenue: 3567.89,
  pendingOrders: 8,
  activeCustomers: 1234,
  topSellingProducts: [
    {
      id: 'prod-1',
      name: 'Pizza Margherita',
      image: mockProducts[0].image,
      salesCount: 89,
    },
    {
      id: 'prod-2',
      name: 'Pizza Calabresa',
      image: mockProducts[1].image,
      salesCount: 76,
    },
    {
      id: 'prod-9',
      name: 'X-Bacon Gourmet',
      image: mockProducts[8].image,
      salesCount: 65,
    },
    {
      id: 'prod-7',
      name: 'Espaguete à Carbonara',
      image: mockProducts[6].image,
      salesCount: 54,
    },
  ],
  recentOrders: mockOrders,
};

// ========== Helper Functions ==========

export const getRestaurantById = (id: string) => 
  mockRestaurants.find(r => r.id === id);

export const getCategoriesByRestaurant = (restaurantId: string) =>
  mockCategories.filter(c => c.restaurantId === restaurantId && c.isActive);

export const getProductsByCategory = (categoryId: string) =>
  mockProducts.filter(p => p.categoryId === categoryId && p.isActive);

export const getProductsByRestaurant = (restaurantId: string) =>
  mockProducts.filter(p => p.restaurantId === restaurantId && p.isActive);

export const getFeaturedProducts = (restaurantId: string) =>
  mockProducts.filter(p => p.restaurantId === restaurantId && p.isFeatured && p.isActive);

export const getOrdersByCustomer = (customerId: string) =>
  mockOrders.filter(o => o.customerId === customerId);

export const getOrdersByRestaurant = (restaurantId: string) =>
  mockOrders.filter(o => o.restaurantId === restaurantId);

export const getUserAddresses = (userId: string) =>
  mockAddresses.filter(a => a.userId === userId);

export const getDefaultAddress = (userId: string) =>
  mockAddresses.find(a => a.userId === userId && a.isDefault);
