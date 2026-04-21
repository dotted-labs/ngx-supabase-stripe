import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { StripePrice, StripeProduct } from '../models/database.model';
import { StripeProductPublic } from '../models/product-public.model';

export type FetchCatalogResult = {
  prices: StripePrice[];
  products: StripeProductPublic[];
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly supabaseService = inject(SupabaseClientService);

  /**
   * Map a Stripe product row plus price rows to the public shape used by the UI.
   */
  toStripeProductPublic(product: StripeProduct, prices: StripePrice[] = []): StripeProductPublic {
    return this.parseProduct(product, prices);
  }

  /**
   * Load all Stripe prices and products, returning parsed public products.
   */
  async fetchFullCatalog(): Promise<{ data: FetchCatalogResult | null; error: Error | null }> {
    const [pricesResult, productsResult] = await Promise.all([
      this.supabaseService.selectStripePrices(),
      this.supabaseService.selectStripeProducts(),
    ]);

    const pricesError = pricesResult.error as Error | null;
    const productsError = productsResult.error as Error | null;

    if (pricesError) {
      return { data: null, error: pricesError };
    }
    if (productsError) {
      return { data: null, error: productsError };
    }

    const prices = (pricesResult.data ?? []) as StripePrice[];
    const stripeProducts = (productsResult.data ?? []) as StripeProduct[];

    const products = stripeProducts.map((product) => this.parseProduct(product, prices));

    return { data: { prices, products }, error: null };
  }

  /**
   * Load prices and a single product by id, returning parsed public product(s).
   */
  async fetchProductById(
    id: string,
  ): Promise<{ data: StripeProductPublic[]; error: Error | null }> {
    const [pricesResult, productResult] = await Promise.all([
      this.supabaseService.selectStripePrices(),
      this.supabaseService.selectStripeProduct(id),
    ]);

    const pricesError = pricesResult.error as Error | null;
    const productError = productResult.error as Error | null;

    if (pricesError) {
      return { data: [], error: pricesError };
    }
    if (productError) {
      return { data: [], error: productError };
    }

    const prices = (pricesResult.data ?? []) as StripePrice[];
    const rows = productResult.data as StripeProduct[] | null;
    if (!rows?.length) {
      return { data: [], error: null };
    }

    return { data: [this.parseProduct(rows[0], prices)], error: null };
  }

  /**
   * Load prices and products for the given Stripe product ids.
   */
  async fetchProductsByIds(
    ids: string[],
  ): Promise<{ data: StripeProductPublic[]; error: Error | null }> {
    const [pricesResult, productsResult] = await Promise.all([
      this.supabaseService.selectStripePrices(),
      this.supabaseService.selectStripeProductsByIds(ids),
    ]);

    const pricesError = pricesResult.error as Error | null;
    const productsError = productsResult.error as Error | null;

    if (pricesError) {
      return { data: [], error: pricesError };
    }
    if (productsError) {
      return { data: [], error: productsError };
    }

    const prices = (pricesResult.data ?? []) as StripePrice[];
    const stripeProducts = (productsResult.data ?? []) as StripeProduct[];

    const products = stripeProducts.map((product) => this.parseProduct(product, prices));

    return { data: products, error: null };
  }

  private parseProduct(product: StripeProduct, prices: StripePrice[] = []): StripeProductPublic {
    const { attrs, ...mainProperties } = product;
    return {
      ...mainProperties,
      images: (attrs as { images?: string[] })?.images ?? [],
      prices: prices
        .filter((price) => price.product === product.id)
        .map((price) => ({
          details: price,
          recurringInterval: (price?.attrs as { recurring?: { interval?: string } })?.recurring?.interval ?? 'no-recurring',
        })),
    };
  }
}
