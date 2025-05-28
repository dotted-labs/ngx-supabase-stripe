import Stripe from 'stripe';
import { StripeEnvironmentConfig } from '../types';

/**
 * Create a Stripe instance for edge functions
 */
export function createStripeInstance(config: StripeEnvironmentConfig): Stripe {
  return new Stripe(config.stripeSecretKey, {
    apiVersion: config.apiVersion || '2025-02-24.acacia'
  });
} 