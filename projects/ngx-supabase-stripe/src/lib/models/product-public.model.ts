import { StripePrice, StripeProduct } from './database.model';

export type StripePricePublic = Omit<StripePrice, 'attrs'>;

export type StripeProductPublic = Omit<StripeProduct, 'attrs'> & {
  images: string[];
  prices: {
    details: StripePricePublic;
    recurringInterval: string;
  }[];
};
