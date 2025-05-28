import Stripe from 'stripe';
import { StripeEnvironmentConfig, CheckoutSessionParams } from '../../types';
import { createStripeInstance } from '../utils';
import { corsHeaders } from '../../shared/cors';

/**
 * Create a checkout session for one-time payments
 * Replicates the logic from checkout_session edge function
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = createStripeInstance(stripeConfig);
    const { priceId, resultPagePath, customer } = params;

    console.log('🔌 [createCheckoutSession]: Creating checkout session', priceId, resultPagePath, customer);

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

    console.log('🔌 [createCheckoutSession]: Session options', JSON.stringify(sessionOptions));

    const session = await stripe.checkout.sessions.create(sessionOptions);

    console.log('🔌 [createCheckoutSession]: Checkout session created', session);
    
    return new Response(JSON.stringify(session.client_secret), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error) {
    console.error('[❌ checkout_session error]: ', error);

    return new Response(JSON.stringify({
      error: 'An unknown error occurred'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500
    });
  }
} 