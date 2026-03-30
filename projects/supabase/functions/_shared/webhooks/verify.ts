import Stripe from 'stripe';
import { createStripeInstance } from '../stripe-core/utils.ts';
import type { StripeEnvironmentConfig } from '../stripe-core/types.ts';

/**
 * Verifies `Stripe-Signature` and parses the webhook payload. Requires a valid Stripe API key
 * because verification runs on a Stripe client instance.
 *
 * Uses `constructEventAsync` so Web Crypto (SubtleCrypto) works on Deno / Supabase Edge, where
 * the sync `constructEvent` path is not supported.
 */
export async function verifyStripeWebhook(
  rawBody: string,
  stripeSignature: string | null,
  webhookSecret: string,
  stripeConfig: StripeEnvironmentConfig,
): Promise<Stripe.Event> {
  if (!stripeSignature) {
    throw new Error('Missing stripe-signature header');
  }
  const stripe = createStripeInstance(stripeConfig);
  return await stripe.webhooks.constructEventAsync(rawBody, stripeSignature, webhookSecret);
}
