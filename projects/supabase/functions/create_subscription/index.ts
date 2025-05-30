import { createSubscription } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../_shared/api.ts';
import type { StripeSubscriptionSession } from 'supabase-stripe-core/types';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeSubscriptionSession = await createSubscription(
      { priceId, resultPagePath, customer },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! } 
    );

    if (error) {  
      return APIResponse<StripeSubscriptionSession['error']>(error, 500);
    }

    return APIResponse<StripeSubscriptionSession['data']>(data, 200);

  } catch (error) {
    return error as Response;
  }
});
