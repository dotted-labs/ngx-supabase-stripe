import Stripe from 'stripe';
import { StripeEnvironmentConfig, SubscriptionParams } from '../../types';
import { createStripeInstance } from './utils';
import { corsHeaders } from '../cors';

/**
 * Create a subscription checkout session
 * Replicates the logic from create_subscription edge function
 */
export async function createSubscription(
  params: SubscriptionParams, 
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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
      return_url: `${resultPagePath}?session_id={CHECKOUT_SESSION_ID}`,
    };

    // Configure customer options
    if (customer && customer.id) {
      sessionOptions.customer = customer.id;
    } else {
      if (customer && customer.email) {
        sessionOptions.customer_email = customer.email;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    
    return new Response(JSON.stringify(session.client_secret), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error) {
    console.error('[❌ createSubscription error]: ', error);
    
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