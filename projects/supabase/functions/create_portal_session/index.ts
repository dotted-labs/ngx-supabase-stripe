import { createPortalSession } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../shared/api.ts';
import type { StripePortalSession } from 'supabase-stripe-core/types';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerId, returnUrl } = await req.json();

    const response: StripePortalSession = await createPortalSession(
      { customerId, returnUrl },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (response.error) {
      return APIResponse<StripePortalSession>(response, 500);
    }

    return APIResponse<StripePortalSession>(response, 200);
  } catch (error) {
    return error as Response;
  }
});