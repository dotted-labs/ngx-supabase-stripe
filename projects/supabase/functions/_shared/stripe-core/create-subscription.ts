import Stripe from 'stripe';
import { StripeEnvironmentConfig, SubscriptionParams, SupabaseStripeResponse } from './types.ts';
import { buildEmbeddedCheckoutReturnUrl } from './return-url.ts';
import { createStripeInstance } from './utils.ts';

export type StripeSubscriptionSession = SupabaseStripeResponse<Stripe.Checkout.Session>;

export async function createSubscription(
  params: SubscriptionParams, 
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeSubscriptionSession> {

  try {
    const stripe = createStripeInstance(stripeConfig);
    const { priceId, resultPagePath, customer } = params;

    console.log('🔌 [createSubscription]: Creating subscription', priceId, resultPagePath, customer);

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1 
        }
      ],
      mode: 'subscription',
      payment_method_types: ['card', 'paypal', 'amazon_pay'],
      return_url: buildEmbeddedCheckoutReturnUrl(resultPagePath),
    };

    // Configure customer options
    if (customer && customer.id) {
      sessionOptions.customer = customer.id;
    } else {
      if (customer && customer.email) {
        sessionOptions.customer_email = customer.email;
      }
    }
    
    return {
      data: await stripe.checkout.sessions.create(sessionOptions),
      error: null
    };
  } catch (error) {
    console.error('[❌ createSubscription error]: ', error);
    
    return {
      data: null,
      error: error
    };
  }
}
