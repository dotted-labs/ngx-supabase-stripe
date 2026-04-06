import { createCheckoutSession, type StripeCheckoutSession } from '../_shared/stripe-core/checkout-session.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';
import { getStripeSecretKeyOrThrow } from '../_shared/stripe-core/utils.ts';

Deno.serve(serveWithAuth(async (req: Request, ctx) => {
  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeCheckoutSession = await createCheckoutSession(
      { priceId, resultPagePath, customer, supabaseUserId: ctx.userId },
      getStripeSecretKeyOrThrow()
    );

    if (error) {
      return APIResponse<StripeCheckoutSession['error']>(error, 500);
    }

    return APIResponse<StripeCheckoutSession['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
}));