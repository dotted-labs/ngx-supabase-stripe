import Stripe from 'stripe';
import { StripeEnvironmentConfig, SessionStatusParams, SupabaseStripeResponse } from './types.ts';
import { createStripeInstance } from './utils.ts';

export type StripeSessionStatus = SupabaseStripeResponse<Stripe.Checkout.Session>;

export async function getSessionStatus(
  params: SessionStatusParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeSessionStatus> {

  try {
    const stripe = createStripeInstance(stripeConfig);
    const { sessionId } = params;

    return {
      data: await stripe.checkout.sessions.retrieve(sessionId),
      error: null
    };
  } catch (error) {
    console.error('[❌ session_status error]: ', error);
    
    return {
      data: null,
      error: error
    };
  }
}
