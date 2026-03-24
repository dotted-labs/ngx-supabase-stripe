import { InjectionToken, Provider } from '@angular/core';

/**
 * Stripe configuration interface
 */
export interface StripeConfig {
  /**
   * Stripe client secret
   */
  publishableKey: string;

  /**
   * Public origin for embedded Checkout return URLs (e.g. https://app.example.com).
   * Use this when the app does not run on http(s), e.g. Electron with file:// — Stripe rejects non-http(s) return_url.
   * When omitted, components use `window.location.origin`.
   */
  embeddedCheckoutBaseUrl?: string;
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