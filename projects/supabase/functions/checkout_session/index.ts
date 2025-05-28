import { createCheckoutSession } from 'supabase-stripe-core';
import type { StripeCheckoutSession } from 'supabase-stripe-core/types';
import { APIResponse, corsHeaders } from '../shared/api.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const response: StripeCheckoutSession = await createCheckoutSession(
      { priceId, resultPagePath, customer },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    console.log('[checkout_session] response:', response);

    if (response.error) {
      return APIResponse<StripeCheckoutSession>(response, 500);
    }

    return APIResponse<StripeCheckoutSession>(response, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
});
