import { getCustomerPaymentMethod, type StripeCustomerPaymentMethod } from '../_shared/stripe-core/customer-payment-method.ts';
import { corsHeaders, APIResponse } from '../_shared/api.ts';

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
