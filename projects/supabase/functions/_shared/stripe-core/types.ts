import Stripe from 'stripe';

export interface SupabaseStripeResponse<T = any> {
  data: T | null;
  error: unknown | null;
}

export interface StripeEnvironmentConfig {
  stripeSecretKey: string;
  apiVersion?: '2025-08-27.basil';
}

export interface CheckoutSessionParams {
  priceId: string;
  resultPagePath: string;
  supabaseUserId: string;
  customer?: Stripe.Customer | null;
}

export interface PortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export interface SubscriptionParams {
  priceId: string;
  resultPagePath: string;
  supabaseUserId: string;
  customer?: Stripe.Customer | null;
}

export interface SessionStatusParams {
  sessionId: string;
}

export interface CustomerPaymentMethodParams {
  customerId: string;
  paymentMethodId: string;
}

export interface CustomerPaymentMethodsParams {
  customerId: string;
  type?: Stripe.PaymentMethodListParams.Type;
  limit?: number;
}
