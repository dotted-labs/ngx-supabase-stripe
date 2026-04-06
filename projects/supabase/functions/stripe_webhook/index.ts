import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';
import { jsonResponse } from '../_shared/api.ts';
import { getStripeSecretKeyOrThrow } from '../_shared/stripe-core/utils.ts';
import { handleStripeWebhookEvent } from '../_shared/webhooks/dispatch/stripe-webhook-dispatcher.ts';
import { verifyStripeWebhook } from '../_shared/webhooks/verify.ts';
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

  try {
    return await handleStripeWebhookEvent({ event, supabaseUrl, serviceRoleKey });
  } catch (e) {
    console.error('[stripe_webhook] Dispatcher error:', e);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
});
