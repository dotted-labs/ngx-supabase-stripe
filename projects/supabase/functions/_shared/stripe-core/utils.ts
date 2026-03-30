import Stripe from 'stripe';
import { StripeEnvironmentConfig } from './types.ts';

export function getStripeSecretKeyOrThrow(): StripeEnvironmentConfig {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return { stripeSecretKey };
}

export function createStripeInstance(config: StripeEnvironmentConfig): Stripe {
  return new Stripe(config.stripeSecretKey, {
    apiVersion: config.apiVersion || '2025-08-27.basil',
  });
}
