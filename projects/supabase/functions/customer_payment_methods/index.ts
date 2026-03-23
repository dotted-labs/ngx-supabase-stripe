import { getCustomerPaymentMethods, type StripeCustomerPaymentMethods } from '../_shared/stripe-core/customer-payment-methods.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req: Request) => {
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
}));