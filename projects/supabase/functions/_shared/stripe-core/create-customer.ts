import Stripe from 'stripe';
import { StripeEnvironmentConfig, SupabaseStripeResponse } from './types.ts';
import { createStripeInstance } from './utils.ts';

export type StripeCustomer = SupabaseStripeResponse<Stripe.Customer>;

export async function createCustomer(
  customerEmail: string,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeCustomer> {
  try {
    const stripe = createStripeInstance(stripeConfig);
    const customer = await stripe.customers.create({ email: customerEmail });
    console.log('🔌 [createCustomer]: Customer created', customer);
    
    return { data: customer, error: null };
  } catch (error) {
    console.error('[❌ createCustomer error]: ', error);
    return { data: null, error: error as Error };
  }
}
