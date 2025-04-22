// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import Stripe from 'npm:stripe@17.7.0';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-02-24.acacia',
  httpClient: Stripe.createFetchHttpClient()
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, resultPagePath, customer } = await req.json();

    console.log('🔌 [checkout_session]: Creating checkout session', priceId, resultPagePath, customer);

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
    }

    // If the customer already exists, use their ID
    if (customer && customer.id) {
      sessionOptions.customer = customer.id;
    } else {
      // If the customer has an email, use it
      if (customer && customer.email) {
        sessionOptions.customer_email = customer.email;
      }

      // If the customer doesn't exist, create a new one
      sessionOptions.customer_creation = 'always';
    }

    console.log('🔌 [checkout_session]: Session options', JSON.stringify(sessionOptions));

    const session = await stripe.checkout.sessions.create(sessionOptions);

    console.log('🔌 [checkout_session]: Checkout session created', session);
    return new Response(JSON.stringify({
      clientSecret: session.client_secret
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error: unknown) {
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
});
