import { getSessionStatus, type StripeSessionStatus } from '../_shared/stripe-core/session-status.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req) => {
  try {
    const { sessionId } = await req.json();
    
    const { data, error }: StripeSessionStatus = await getSessionStatus(
      { sessionId },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripeSessionStatus['error']>(error, 500);
    }

    return APIResponse<StripeSessionStatus['data']>(data, 200);

  } catch (error) {
    return APIResponse(error, 500);
  }
}));