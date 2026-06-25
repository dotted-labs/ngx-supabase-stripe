import Stripe from 'stripe';
import { StripeEnvironmentConfig, PortalSessionParams, SupabaseStripeResponse } from './types.ts';
import { createStripeInstance, resolveCheckoutLocale } from './utils.ts';

export type StripePortalSession = SupabaseStripeResponse<Stripe.BillingPortal.Session>;

export async function createPortalSession(
  params: PortalSessionParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripePortalSession> {
  try {
    const stripe = createStripeInstance(stripeConfig);
    const { customerId, returnUrl, locale } = params;
    const portalLocale = resolveCheckoutLocale(locale);

    return {
      data: await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
        ...(portalLocale ? { locale: portalLocale } : {}),
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
