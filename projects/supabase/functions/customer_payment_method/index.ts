import { getCustomerPaymentMethod, type StripeCustomerPaymentMethod } from '../_shared/stripe-core/customer-payment-method.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req: Request, _ctx) => {
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
}));
