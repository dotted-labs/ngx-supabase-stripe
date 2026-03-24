import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';
import { createCustomer, type StripeCustomer } from '../_shared/stripe-core/create-customer.ts';

Deno.serve(serveWithAuth(async (req) => {
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
    return APIResponse(error, 500);
  }
}));
