import { Database } from '../../database.types';

// Stripe Schema Types
export type StripeSchemaType = Database['stripe'];
export type StripeTableType<T extends keyof StripeSchemaType['Tables']> = StripeSchemaType['Tables'][T];
export type StripeRowType<T extends keyof StripeSchemaType['Tables']> = StripeSchemaType['Tables'][T]['Row'];
export type StripeInsertType<T extends keyof StripeSchemaType['Tables']> = StripeSchemaType['Tables'][T]['Insert'];
export type StripeUpdateType<T extends keyof StripeSchemaType['Tables']> = StripeSchemaType['Tables'][T]['Update'];

// Stripe Row Types
type StripeProductRow = StripeRowType<'products'>;
export type StripeProduct = Omit<StripeProductRow, 'created' | 'updated'>;

type StripeCheckoutSessionRow = StripeRowType<'checkout_sessions'>;
export type StripeCheckoutSession = Omit<StripeCheckoutSessionRow, 'created' | 'updated'>;

type StripePaymentIntentRow = StripeRowType<'payment_intents'>;
export type StripePaymentIntent = Omit<StripePaymentIntentRow, 'created' | 'updated'>;

type StripePriceRow = StripeRowType<'prices'>;
export type StripePrice = Omit<StripePriceRow, 'created' | 'updated'>;

type StripeSubscriptionRow = StripeRowType<'subscriptions'>;
export type StripeSubscription = Omit<StripeSubscriptionRow, 'created' | 'updated'>;

// Global Stripe type table con prefijo 'stripe.'
export type StripeTables = keyof StripeSchemaType['Tables'];
