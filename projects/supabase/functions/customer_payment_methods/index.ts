import { getCustomerPaymentMethods } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../_shared/api.ts';
import type { StripeCustomerPaymentMethods } from 'supabase-stripe-core/types';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerId, type, limit } = await req.json();

    const { data, error }: StripeCustomerPaymentMethods = await getCustomerPaymentMethods(
      { customerId, type, limit },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! } 
    );

    if (error) {  
      return APIResponse<StripeCustomerPaymentMethods['error']>(error, 500);
    }

    return APIResponse<StripeCustomerPaymentMethods['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
});