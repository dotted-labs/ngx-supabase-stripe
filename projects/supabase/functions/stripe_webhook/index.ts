import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';
import { emptyResponse, jsonResponse } from '../_shared/api.ts';
import { getStripeSecretKeyOrThrow } from '../_shared/stripe-core/utils.ts';
import { verifyStripeWebhook } from '../_shared/webhooks/verify.ts';
import { buildCheckoutCompletedPayload } from '../_shared/webhooks/checkout-session-completed/checkout-session-completed.ts';
import { invokeStripeCheckoutCompletedRpc } from '../_shared/webhooks/checkout-session-completed/checkout-session-completed-rpc.ts';
import { handleCheckoutGrantRpcResult } from '../_shared/webhooks/checkout-session-completed/checkout-grant-rpc-result-handler.ts';
import { loadStripeWebhookEnv } from '../_shared/webhooks/webhook-env.ts';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const envLoad = loadStripeWebhookEnv();
  if (!envLoad.ok) {
    return envLoad.response;
  }
  const { webhookSecret, supabaseUrl, serviceRoleKey } = envLoad.env;

  let event: Stripe.Event;
  const signature = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  try {
    event = await verifyStripeWebhook(rawBody, signature, webhookSecret, getStripeSecretKeyOrThrow());
  } catch (e) {
    console.warn('[stripe_webhook] Signature verification failed:', e);
    return jsonResponse({ error: 'Invalid signature' }, 400);
  }

  console.log('🔌 [stripe_webhook]: Event:', event);
  console.log('🔌 [stripe_webhook]: session type from event:', event.type);

  if (event.type !== 'checkout.session.completed') {
    console.log('🔌 [stripe_webhook]: event type is not checkout.session.completed, skipping');
    return emptyResponse(200);
  }

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
});
