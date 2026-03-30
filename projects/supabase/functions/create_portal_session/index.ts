import { createPortalSession, type StripePortalSession } from '../_shared/stripe-core/create-portal-session.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req, _ctx) => {
  try {
    const { customerId, returnUrl } = await req.json();

    const {data, error}: StripePortalSession = await createPortalSession(
      { customerId, returnUrl },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripePortalSession['error']>(error, 500);
    }

    return APIResponse<StripePortalSession['data']>(data, 200);
  } catch (error) {
    return APIResponse(error, 500);
  }
}));