// src/services/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  likes?: number // Adicione esta linha como opcional
  image: string;
  images: string[]; // Alterado de ProductImage[] para string[]
  category: string;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: { // Adicionado para refletir a relação com usuário
    id: string;
    name: string;
    email: string;
  };
  salePrice: number | null;
  collection?: string | null;
  features: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
}
export interface ProductSize {
  id?: string;
  size: string;
  stock: number;
  productId?: string;
}

export interface ProductColor {
  id?: string;
  colorName: string;
  colorCode: string;  // código hexadecimal
  imageUrl?: string | null;
  stock: number;
  productId?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: Pagination; // Use a interface unificada
}

export interface PaginatedResponse {
  status: string;
  data: Product[];
  pagination: Pagination; // Use a mesma interface
}
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  
}

// Interfaces do Carrinho
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product; // Produto expandido
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para adicionar/atualizar itens
export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutSessionRequest {
  lineItems: CheckoutItem[];
  userId: string;
  // endereço pode ser incluído se necessário
  addressId?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'pix' | 'boleto';
  lastFourDigits?: string; // Para cartões
}

export interface ShippingAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ShippingAddressRequest {
  id: string;
  // Adicione outros campos opcionais se necessário
  postalCode?: string;
}
export interface CheckoutLineItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface CheckoutCustomer {
  userId: string;
  email: string;
  name: string;
  taxId?: string;
}

export interface CheckoutSessionLineItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

// types/checkout.ts
export interface CheckoutSessionRequest {
  customer: {
    userId: string;
    email: string;
    name: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: {
    type: 'credit_card' | 'pix' | 'boleto';
    card?: {
      number: string;
      name: string;
      expiry: string;
      cvc: string;
    };
  };
}
export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  expiresAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'canceled';
  shippingOptions?: {
    id?: string; // ID temporário ou de referência
  }[];
}

export interface CheckoutError {
  type: 'validation' | 'payment' | 'network' | 'timeout';
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Implementação de erro customizado
export class CheckoutServiceError extends Error {
  constructor(
    public readonly type: CheckoutError['type'],
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'CheckoutServiceError';
  }
}

// Interfaces de Ordem do Pedido
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
}

// Interface do Forumalrio de Filtros
export interface ProductFilterFormValues {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
export interface ProductFilterApiParams {
  page?: number;
  limit?: number;
  category?: string;
  name?: string; // Adicionado para busca por nome
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'salePrice';
  sortOrder?: 'asc' | 'desc';
  collection?: string;
  hasDiscount?: boolean;
  searchTerm?: string; // Termo geral de busca
}

// Tipo para formulário de produto
export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  countInStock: string;
  image: File | string | null;
  additionalImages?: (File | string)[];
  additionalImagesFiles?: File[]; // Adicione esta linha
  removedImages?: string[];
  salePrice?: string | null;
  collection?: string | null;
  features: string[];
  sizes: Array<{
    size: string;
    stock: string | number;
    id?: string; // Para edição
  }>;
  colors: Array<{
    colorName: string;
    colorCode: string;
    stock: string | number;
    imageUrl?: string | null;
    id?: string; // Para edição
  }>;
}
export interface ProfileFormData {
  name: string
  email: string
}

export interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

//Interface de Busca por Produto
export interface ProductSearchHook {
  searchProducts: (term: string, filters?: Partial<ProductFilterApiParams>) => Promise<void>;
  searchResults: Product[];
  isSearching: boolean;
  error: string | null;
  clearSearch: () => void;
}