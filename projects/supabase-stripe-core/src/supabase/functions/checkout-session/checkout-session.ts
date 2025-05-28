import Stripe from 'stripe';
import { StripeEnvironmentConfig, CheckoutSessionParams, SupabaseStripeResponse } from '../../types';
import { createStripeInstance } from '../utils';

export type StripeCheckoutSession = SupabaseStripeResponse<Stripe.Checkout.Session>;

export async function createCheckoutSession(
  params: CheckoutSessionParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeCheckoutSession> {
  try {
    const { priceId, resultPagePath, customer } = params;
    const stripe = createStripeInstance(stripeConfig);

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      payment_method_types: ['card', 'paypal', 'amazon_pay', 'alipay'],
      return_url: `${resultPagePath}?session_id={CHECKOUT_SESSION_ID}`,
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