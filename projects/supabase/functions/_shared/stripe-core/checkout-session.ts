import { StripeEnvironmentConfig, CheckoutSessionParams, SupabaseStripeResponse } from './types.ts';
import { buildEmbeddedCheckoutReturnUrl } from './return-url.ts';
import { createStripeInstance } from './utils.ts';
import Stripe from 'stripe';

export type StripeCheckoutSession = SupabaseStripeResponse<Stripe.Checkout.Session>;

export async function createCheckoutSession(
  params: CheckoutSessionParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeCheckoutSession> {
  try {
    const { priceId, resultPagePath, customer, supabaseUserId } = params;
    const stripe = createStripeInstance(stripeConfig);

    const price = await stripe.prices.retrieve(priceId);
    const mode: Stripe.Checkout.SessionCreateParams['mode'] = price.recurring
      ? 'subscription'
      : 'payment';

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode,
      payment_method_types: ['card', 'paypal', 'amazon_pay'],
      return_url: buildEmbeddedCheckoutReturnUrl(resultPagePath),
      client_reference_id: supabaseUserId,
      metadata: { supabase_user_id: supabaseUserId },
    };

    // Configure customer options
    if (customer && customer.id) {
      sessionOptions.customer = customer.id;
    } else {
      if (customer && customer.email) {
        sessionOptions.customer_email = customer.email;
      }
      sessionOptions.customer_creation = 'always';
    }
    return {
      data: await stripe.checkout.sessions.create(sessionOptions),
      error: null
    };
  } catch (error: unknown) {
    console.error('[❌ checkout_session error]: ', error);
    return {
      data: null,
      error: error
    };
  }
}
