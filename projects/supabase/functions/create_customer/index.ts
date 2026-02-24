import { corsHeaders, APIResponse } from '../_shared/api.ts';
import { createCustomer, type StripeCustomer } from '../_shared/stripe-core/create-customer.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerEmail } = await req.json();

    const { data, error } = await createCustomer(customerEmail, {
      stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')!
    });

    if (error) {
      return APIResponse<StripeCustomer['error']>(error, 500);
    }
    return APIResponse<StripeCustomer['data']>(data, 200);
  } catch (error) {
    return error as Response
  }
})
