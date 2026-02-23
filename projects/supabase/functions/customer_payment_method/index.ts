import { getCustomerPaymentMethod } from 'supabase-stripe-core';
import { corsHeaders, APIResponse } from '../_shared/api.ts';
import type { StripeCustomerPaymentMethod } from 'supabase-stripe-core/types';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerId, paymentMethodId } = await req.json();

    const { data, error }: StripeCustomerPaymentMethod = await getCustomerPaymentMethod(
      { customerId, paymentMethodId },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! } 
    );

    if (error) {  
      return APIResponse<StripeCustomerPaymentMethod['error']>(error, 500);
    }

    return APIResponse<StripeCustomerPaymentMethod['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
});
