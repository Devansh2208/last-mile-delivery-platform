// User Roles
export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';

// Order Status Enum
export type OrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RESCHEDULED'
  | 'CANCELLED';

// Order & Payment Types
export type OrderType = 'B2B' | 'B2C';
export type PaymentType = 'PREPAID' | 'COD';

// Auth Schemas
export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
}

// Order Schemas
export interface OrderCreate {
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  delivery_address: string;
  delivery_pincode: string;
  pickup_zone_id: string;
  package_weight: number; // in grams
  length: number; // in cm
  breadth: number; // in cm
  height: number; // in cm
  order_type: OrderType;
  payment_type: PaymentType;
}

export interface OrderResponse {
  id: string;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  delivery_address: string;
  delivery_pincode: string;
  pickup_zone_id: string | null;
  delivery_zone_id: string | null;
  package_weight: number;
  length: number;
  breadth: number;
  height: number;
  volumetric_weight: number;
  billable_weight: number;
  order_type: OrderType;
  payment_type: PaymentType;
  calculated_charge: number | null;
  cod_surcharge: number;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
}

// Zone Schemas
export interface ZoneCreate {
  name: string;
  code: string;
  description?: string | null;
}

export interface ZoneResponse {
  id: string;
  name: string;
  code: string;
  description: string | null;
  active: boolean;
}

export interface ZoneMappingCreate {
  pincode: string;
}

export interface ZoneMappingResponse {
  id: string;
  zone_id: string;
  pincode: string;
}

// Rate Card Schemas
export interface RateCardCreate {
  origin_zone_id: string;
  destination_zone_id: string;
  order_type: OrderType;
  base_rate: number;
  rate_per_kg: number;
  cod_surcharge?: number;
}

export interface RateCardResponse {
  id: string;
  origin_zone_id: string;
  destination_zone_id: string;
  order_type: string;
  base_rate: number;
  rate_per_kg: number;
  cod_surcharge: number;
  active: boolean;
}

export interface PriceCalculationResult {
  tracking_number: string;
  pickup_zone_id: string;
  delivery_zone_id: string;
  package_weight_grams: number;
  volumetric_weight: number;
  billable_weight: number;
  order_type: string;
  payment_type: string;
  base_rate: number;
  rate_per_kg: number;
  cod_surcharge: number;
  total_price: number;
}

// Agent Schemas
export interface AgentCreate {
  name: string;
  phone: string;
}

export interface AgentResponse {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  available: boolean;
}

export interface AgentAssignmentResponse {
  message: string;
  tracking_number: string;
  agent_id: string;
  agent_name: string;
  status: string;
}

// Tracking Schemas
export interface TrackingCreate {
  status: string;
  location?: string | null;
  description?: string | null;
}

export interface TrackingResponse {
  id: string;
  order_id: string;
  status: string;
  location: string | null;
  description: string | null;
  created_at?: string;
}

// UI State Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

