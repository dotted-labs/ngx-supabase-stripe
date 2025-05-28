import { createSubscription } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../shared/api.ts';
import type { StripeSubscriptionSession } from 'supabase-stripe-core/types';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const response: StripeSubscriptionSession = await createSubscription(
      { priceId, resultPagePath, customer },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! } 
    );

    if (response.error) {  
      return APIResponse<StripeSubscriptionSession>(response, 500);
    }

    return APIResponse<StripeSubscriptionSession>(response, 200);

  } catch (error) {
    return error as Response;
  }
});
