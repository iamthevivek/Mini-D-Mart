export type Role = 'CUSTOMER' | 'STAFF' | 'MANAGER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: Category;
  sku: string;
  barcode?: string;
  imageUrl?: string;
  unit: string;
  mrpPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  inStock: boolean;
  isReturnable: boolean;
  returnWindowDays: number;
  discountPercentage: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  itemPrice: number;
  subtotal: number;
  isAvailable: boolean;
  availabilityMessage: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  eligibleForFreeDelivery: boolean;
  amountNeededForFreeDelivery: number;
  estimatedTax: number;
  totalAmount: number;
  hasUnavailableItems: boolean;
}

export interface PickupSlot {
  id: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  formattedSlot: string;
  maxCapacity: number;
  bookedCount: number;
  remainingCapacity: number;
  available: boolean;
  active: boolean;
}

export type FulfillmentType = 'STORE_PICKUP' | 'HOME_DELIVERY';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PICKED_UP'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImageUrl?: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isReturnedOrExchanged: boolean;
  isReturnable: boolean;
  returnWindowDays: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryPincode?: string;
  deliveryPhone?: string;
  deliveryInstructions?: string;
  pickupSlot?: PickupSlot;
  pickupVerificationCode?: string;
  cancellationReason?: string;
  staffNotes?: string;
  items: OrderItem[];
  totalItems: number;
  placedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  canCancel: boolean;
  canReturn: boolean;
}

export type ReturnType = 'RETURN' | 'EXCHANGE';

export type ReturnReason =
  | 'DAMAGED'
  | 'WRONG_ITEM'
  | 'EXPIRED'
  | 'QUALITY_ISSUE'
  | 'DEFECTIVE'
  | 'OTHER';

export type ReturnStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COLLECTED'
  | 'COMPLETED';

export interface ReturnRequest {
  id: number;
  requestNumber: string;
  orderId: number;
  orderNumber: string;
  orderItem: OrderItem;
  userId: number;
  userName: string;
  userEmail: string;
  type: ReturnType;
  reason: ReturnReason;
  details?: string;
  imageEvidenceUrl?: string;
  exchangeProduct?: Product;
  status: ReturnStatus;
  refundAmount: number;
  staffReviewNotes?: string;
  reviewedByName?: string;
  restockItem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnEligibility {
  isEligible: boolean;
  reasonMessage: string;
  daysRemaining: number;
  isReturnableCategory: boolean;
  isDelivered: boolean;
}

export interface StoreDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  cancelledOrders: number;
  lowStockCount: number;
  pendingReturnsCount: number;
  totalProducts: number;
  totalUsers: number;
  returnRatePercent: number;
  recentOrders: Order[];
  recentReturns: ReturnRequest[];
}

export interface AuditLog {
  id: number;
  action: string;
  entityName: string;
  entityId?: string;
  userId?: number;
  userEmail?: string;
  role?: string;
  ipAddress?: string;
  details?: string;
  timestamp: string;
}
