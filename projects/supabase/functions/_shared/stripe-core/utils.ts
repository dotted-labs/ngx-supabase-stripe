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

const CHECKOUT_LOCALES = new Set<Stripe.Checkout.SessionCreateParams['locale']>([
  'auto', 'bg', 'cs', 'da', 'de', 'el', 'en', 'en-GB', 'es', 'es-419', 'et', 'fi', 'fil',
  'fr', 'fr-CA', 'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'ms', 'mt', 'nb', 'nl',
  'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'vi', 'zh', 'zh-HK', 'zh-TW',
]);

export function resolveCheckoutLocale(
  locale?: string,
): Stripe.Checkout.SessionCreateParams['locale'] | undefined {
  if (!locale) {
    return undefined;
  }
  return CHECKOUT_LOCALES.has(locale as Stripe.Checkout.SessionCreateParams['locale'])
    ? (locale as Stripe.Checkout.SessionCreateParams['locale'])
    : undefined;
}
