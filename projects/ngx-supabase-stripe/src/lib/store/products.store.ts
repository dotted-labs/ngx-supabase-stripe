import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { StripePrice, StripeProduct } from '../models/database.model';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Currency } from '../models/currency.model';

export type StripeProductPublic = Omit<StripeProduct, 'attrs'> & {
  images: string[];
  prices: {
    details: StripePricePublic;
    recurringInterval: string;
  }[];
}

export type StripePricePublic = Omit<StripePrice, 'attrs'>;

export type ProductsStatus = 'idle' | 'loading' | 'success' | 'error';

type ProductsState = {
  products: StripeProductPublic[];
  prices: StripePricePublic[];
  status: ProductsStatus;
  error: string | null;
  currency: Currency;
}

const initialProductsState: ProductsState = {
  products: [],
  prices: [],
  status: 'idle',
  error: null,
  currency: Currency.EUR,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withComputed((state) => ({
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
    oneTimeproductsByCurrency: computed(() => state.products().filter(product => 
      product.prices.some(price => (price.details.type === 'one_time' && price.details.currency === state.currency()))
    ) || []),
    recurringProductsByCurrency: computed(() => state.products().filter(product => 
      product.prices.some(price => (price.details.type === 'recurring' && price.details.currency === state.currency()))
    ) || []),
    productsByCurrency: computed(() => state.products().filter(product => 
      product.prices.some(price => (price.details.currency === state.currency()))
    ) || []),
    hasProducts: computed(() => state.products().length > 0),
    isError: computed(() => state.error())
  })),
  withMethods((store, supabaseService = inject(SupabaseClientService)) => ({
    /**
     * Get products by IDs from the current loaded products
     */
    getProductsByIds(ids: string[]): StripeProductPublic[] {
      console.log('🎮 [ProductsStore] Loading products by ids: ', ids);
      return store.products()?.filter(product => product.id && ids.includes(product.id)) || [];
    },

    /**
     * Set the currency filter for products
     */
    setCurrency(currency: Currency): void {
      patchState(store, { currency });
    },

    /**
     * Load product by id
     */
    async loadProductById(id: string) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { data: product, error: productError } = await supabaseService.selectStripeProduct(id);
        
        if (productError) {
          console.error('🎮 [ProductsStore]: Error loading product', productError);
          patchState(store, { status: 'error', error: (productError as Error).message });
        }

        const products: StripeProductPublic[] = [];
        
        if (product && product.length > 0) {
          const productParsed = parseProduct(product[0], store.prices() as StripePrice[]);
          products.push(productParsed);
        }

        patchState(store, { status: 'success', products });
        
      } catch (error) {
        patchState(store, { status: 'error', error: (error as Error).message });
      }
    },

    /**
     * Load products from Stripe
     */
    async loadProducts() {
      patchState(store, { status: 'loading', error: null });

      try {
        const { data: prices, error: pricesError } = await supabaseService.selectStripePrices();

        if (pricesError) {
          console.error('🎮 [ProductsStore]: Error loading prices', pricesError);
          patchState(store, { status: 'error', error: (pricesError as Error).message });
        }
        
        patchState(store, { prices: prices || [] });

        const { data: stripeProducts, error: productsError } = await supabaseService.selectStripeProducts();

        if (productsError) {
          console.error('🎮 [ProductsStore]: Error loading products', productsError);
          patchState(store, {
            status: 'error',
            error: (productsError as Error).message,
          });
        }

        if (stripeProducts) {
          {
            const products: StripeProductPublic[] = [];

            stripeProducts.forEach(product => {
              products.push(parseProduct(product, store.prices() as StripePrice[]));
            });

            console.log('🎮 [ProductsStore] products: ', products);

            patchState(store, {
              status: 'success',
              products: products
            });
          }
        }

      } catch (error) {
        patchState(store, {
          status: 'error',
          error: (error as Error).message,
        });
      }
    },

    /**
     * Reset the store to initial state
     */
    reset() {
      patchState(store, initialProductsState);
    }
  })),
  withHooks((store) => ({
    async onInit() {
      console.log('🎮 [ProductsStore] onInit');

      const products = store.products();
      console.log('🎮 [ProductsStore] products: ', products);

      if (!products) {
        console.log('🎮 [ProductsStore] loading products...');
        await store.loadProducts();
      }
    }
  }))
)

export function parseProduct(product: StripeProduct, prices: StripePrice[] = []): StripeProductPublic {
  const { attrs, ...mainProperties } = product;
  return {
    ...mainProperties,
    images: (attrs as any)?.images || [],
    prices: prices.filter(price => price.product === product.id).map(price => ({
      details: price,
      recurringInterval: (price?.attrs as any)?.recurring?.interval || 'no-recurring'
    }))
  };
}

