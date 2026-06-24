import enMessages from './messages.en.json';
import esMessages from './messages.es.json';

export const STRIPE_LOCALES = ['es', 'en'] as const;
export type StripeLocale = (typeof STRIPE_LOCALES)[number];

export type StripeMessagesFile = {
  locale: string;
  translations: Record<string, string>;
};

const MESSAGES: Record<string, StripeMessagesFile> = {
  en: enMessages as StripeMessagesFile,
  es: esMessages as StripeMessagesFile,
};

/**
 * Loads stripe translation messages for the given locale.
 * Falls back to English when the locale is not available.
 * The app consumer must merge the result into `loadTranslations()` before bootstrap.
 */
export const loadStripeMessages = async (locale: string): Promise<StripeMessagesFile> => {
  return MESSAGES[locale] ?? enMessages as StripeMessagesFile;
};
