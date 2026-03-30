import { createSubscription, type StripeSubscriptionSession } from '../_shared/stripe-core/create-subscription.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';
import { getStripeSecretKeyOrThrow } from '../_shared/stripe-core/utils.ts';

Deno.serve(serveWithAuth(async (req: Request, ctx) => {
  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeSubscriptionSession = await createSubscription(
      { priceId, resultPagePath, customer, supabaseUserId: ctx.userId },
      getStripeSecretKeyOrThrow()
    );

    if (error) {  
      return APIResponse<StripeSubscriptionSession['error']>(error, 500);
    }

    return APIResponse<StripeSubscriptionSession['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
}));
