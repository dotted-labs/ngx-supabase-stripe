import { InjectionToken, Provider } from '@angular/core';

/**
 * Stripe configuration interface
 */
export interface StripeConfig {
  /**
   * Stripe client secret
   */
  publishableKey: string;
}

export const STRIPE_CONFIG = new InjectionToken<StripeConfig>('STRIPE_CONFIG');

/**
 * Provides the Stripe configuration
 * @param config The Stripe configuration
 * @returns An array of providers
 */
export function provideStripeConfig(config: StripeConfig): Provider[] {
  return [
    {
      provide: STRIPE_CONFIG,
      useValue: config
    }
  ];
}