export * from './database.types';

// Common response type for operations
export interface SupabaseStripeResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Customer types
export interface StripeCustomerPublic {
  id: string;
  email: string;
  name?: string;
  description?: string;
}

// Subscription types
export interface SubscriptionInfo {
  id: string;
  customer: string;
  currency: string;
  current_period_start: string;
  current_period_end: string;
  status?: string;
  attrs?: any;
}

// Product types
export interface ProductInfo {
  id: string;
  name: string;
  active: boolean;
  default_price: string;
  description: string;
  attrs?: any;
}

// Price types
export interface PriceInfo {
  id: string;
  active: boolean;
  currency: string;
  product: string;
  unit_amount: number;
  type: string;
  attrs?: any;
}

// Payment Intent types
export interface PaymentIntentInfo {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  payment_method: string;
  created: string;
  attrs?: any;
}

// Configuration interface for Stripe in edge functions
export interface StripeEnvironmentConfig {
  stripeSecretKey: string;
  apiVersion?: '2025-02-24.acacia';
}

// Checkout session parameters
export interface CheckoutSessionParams {
  priceId: string;
  resultPagePath: string;
  customer?: StripeCustomerPublic | null;
}

// Portal session parameters  
export interface PortalSessionParams {
  customerId: string;
  returnUrl: string;
}

// Subscription parameters (same as checkout but different mode)
export interface SubscriptionParams {
  priceId: string;
  resultPagePath: string;
  customer?: StripeCustomerPublic | null;
}

// Session status parameters
export interface SessionStatusParams {
  sessionId: string;
} 