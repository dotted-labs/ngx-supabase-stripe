import { createPortalSession } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../_shared/api.ts';
import type { StripePortalSession } from 'supabase-stripe-core/types';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerId, returnUrl } = await req.json();

    const {data, error}: StripePortalSession = await createPortalSession(
      { customerId, returnUrl },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripePortalSession['error']>(error, 500);
    }

    return APIResponse<StripePortalSession['data']>(data, 200);
  } catch (error) {
    return error as Response;
  }
});