import Stripe from 'stripe';
import { emptyResponse, jsonResponse } from '../../api.ts';
import { getStripeSecretKeyOrThrow } from '../../stripe-core/utils.ts';
import { buildCheckoutCompletedPayload } from '../checkout-session-completed/checkout-session-completed.ts';
import { invokeStripeCheckoutCompletedRpc } from '../checkout-session-completed/checkout-session-completed-rpc.ts';
import { handleCheckoutGrantRpcResult } from '../checkout-session-completed/checkout-grant-rpc-result-handler.ts';
import type { StripeEventHandler } from './stripe-event-handler.ts';

export const checkoutSessionCompletedHandler: StripeEventHandler = {
  async execute(ctx) {
    const { event, supabaseUrl, serviceRoleKey } = ctx;
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const payload = await buildCheckoutCompletedPayload(getStripeSecretKeyOrThrow(), session);

      if (!payload.supabaseUserId) {
        console.warn('[stripe_webhook] Missing supabase_user_id / client_reference_id', {
          stripe_event_id: event.id,
          session_id: payload.sessionId || session.id,
        });
        return emptyResponse(200);
      }

      const outcome = await invokeStripeCheckoutCompletedRpc({
        supabaseUrl,
        serviceRoleKey,
        supabaseUserId: payload.supabaseUserId,
        stripeEventId: event.id,
        lineItems: payload.lineItems,
        sessionId: payload.sessionId,
        mode: payload.mode,
        subscriptionId: payload.subscriptionId,
        customerId: payload.customerId,
      });

      return handleCheckoutGrantRpcResult(outcome, {
        stripeEventId: event.id,
        sessionId: payload.sessionId,
        supabaseUserId: payload.supabaseUserId,
      });
    } catch (e) {
      console.error('[stripe_webhook] Handler error:', e);
      return jsonResponse({ error: 'Internal error' }, 500);
    }
  },
};
