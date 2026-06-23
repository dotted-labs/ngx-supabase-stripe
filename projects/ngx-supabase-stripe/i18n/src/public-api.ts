import enMessages from './messages.en.json';
import esMessages from './messages.es.json';

export const STRIPE_LOCALES = ['es', 'en'] as const;
export type StripeLocale = (typeof STRIPE_LOCALES)[number];

export type StripeMessagesFile = {
  locale: string;
  translations: Record<string, string>;
};

export async function loadStripeMessages(locale: string): Promise<StripeMessagesFile> {
  switch (locale) {
    case 'es':
      return esMessages as StripeMessagesFile;
    default:
      return enMessages as StripeMessagesFile;
  }
}
