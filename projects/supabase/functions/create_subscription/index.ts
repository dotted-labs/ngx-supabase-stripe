import { createSubscription, type StripeSubscriptionSession } from '../_shared/stripe-core/create-subscription.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req: Request) => {
  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeSubscriptionSession = await createSubscription(
      { priceId, resultPagePath, customer },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! } 
    );

    if (error) {  
      return APIResponse<StripeSubscriptionSession['error']>(error, 500);
    }

    return APIResponse<StripeSubscriptionSession['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
}));
