import Stripe from 'stripe';

// Common response type for operations
export interface SupabaseStripeResponse<T = any> {
  data: T | null;
  error: Error | null;
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
  customer?: Stripe.Customer | null;
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
  customer?: Stripe.Customer | null;
}

// Session status parameters
export interface SessionStatusParams {
  sessionId: string;
} 