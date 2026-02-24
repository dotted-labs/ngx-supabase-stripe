import Stripe from 'stripe';
import { StripeEnvironmentConfig } from './types.ts';

export function createStripeInstance(config: StripeEnvironmentConfig): Stripe {
  return new Stripe(config.stripeSecretKey, {
    apiVersion: config.apiVersion || '2025-04-30.basil'
  });
}
