import { createCheckoutSession } from 'supabase-stripe-core';
import type { StripeCheckoutSession } from 'supabase-stripe-core/types';
import { APIResponse, corsHeaders } from '../_shared/api.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeCheckoutSession = await createCheckoutSession(
      { priceId, resultPagePath, customer },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripeCheckoutSession['error']>(error, 500);
    }

    return APIResponse<StripeCheckoutSession['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
});
