import Stripe from 'stripe';
import { StripeEnvironmentConfig, PortalSessionParams, SupabaseStripeResponse } from '../../types';
import { createStripeInstance } from '../utils';

export type StripePortalSession = SupabaseStripeResponse<Stripe.BillingPortal.Session>;

export async function createPortalSession(
  params: PortalSessionParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripePortalSession> {
  try {
    const stripe = createStripeInstance(stripeConfig);
    const { customerId, returnUrl } = params;

    return {
      data: await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      }),
      error: null
    };
  } catch (error) {
    console.error('❌ [create_portal_session]: Error creating portal session:', error);
    
    return {
      data: null,
      error: error
    };
  }
} 