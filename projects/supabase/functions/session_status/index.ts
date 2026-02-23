import { getSessionStatus } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../_shared/api.ts';
import type { StripeSessionStatus } from 'supabase-stripe-core/types';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json();
    
    const { data, error }: StripeSessionStatus = await getSessionStatus(
      { sessionId },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripeSessionStatus['error']>(error, 500);
    }

    return APIResponse<StripeSessionStatus['data']>(data, 200);

  } catch (error) {
    return error as Response;
  }
})