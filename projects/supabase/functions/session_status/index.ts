import { getSessionStatus } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../shared/api.ts';
import type { StripeSessionStatus } from 'supabase-stripe-core/types';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json();
    
    const response: StripeSessionStatus = await getSessionStatus(
      { sessionId },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (response.error) {
      return APIResponse<StripeSessionStatus>(response, 500);
    }

    return APIResponse<StripeSessionStatus>(response, 200);

  } catch (error) {
    return error as Response;
  }
})