/**
 * Stripe configuration interface
 */
export interface StripeConfig {
  /**
   * Stripe publishable key
   */
  publishableKey: string;
}

/**
 * Default Stripe configuration
 */
let stripeConfig: StripeConfig | null = null;

/**
 * Configure Stripe settings
 * @param config The Stripe configuration
 */
export function configureStripe(config: StripeConfig): void {
  stripeConfig = config;
}

/**
 * Get the current Stripe configuration
 * @returns The Stripe configuration
 */
export function getStripeConfig(): StripeConfig {
  if (!stripeConfig) {
    throw new Error('Stripe configuration not found. Please call configureStripe() first.');
  }
  return stripeConfig;
} 