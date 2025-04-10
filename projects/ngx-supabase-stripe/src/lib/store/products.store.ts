import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { SupabaseClientService, StripeProduct, StripePrice } from '../services/supabase-client.service';

export type StripeProductPublic = Omit<StripeProduct, 'attrs'> & {
  images: string[];
  price_details: StripePricePublic | null;
}

export type StripePricePublic = Omit<StripePrice, 'attrs'>;

/**
 * Status of the products loading process
 */
export type ProductsStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Main state interface for products store
 */
type ProductsState = {
  // The list of products from Stripe
  products: StripeProductPublic[] | null;
  // The list of prices from Stripe
  prices: StripePricePublic[] | null;
  // The current status of the products loading process
  status: ProductsStatus;
  // Error message if any
  error: string | null;
}

/**
 * Initial state for products store
 */
const initialProductsState: ProductsState = {
  products: null,
  prices: null,
  status: 'idle',
  error: null
};

/**
 * Store for managing products state with NgRx Signals
 */
export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsState),
  withComputed((state) => ({
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
    hasProducts: computed(() => state.products() !== null && state.products()!.length > 0),
    isError: computed(() => state.error())
  })),
  withMethods((store, supabaseService = inject(SupabaseClientService)) => ({
    /**
     * Load products from Stripe
     */
    async loadProducts() {
      patchState(store, { status: 'loading', error: null });

      try {
        const { data: prices, error: pricesError } = await supabaseService.selectStripePrices();
        const { data: stripeProducts, error: productsError } = await supabaseService.selectStripeProducts();

        if (pricesError) {
          console.error('🚨 [ProductsStore]: Error loading prices', pricesError);
          patchState(store, {
            status: 'error',
            error: (pricesError as Error).message,
          });
        }

        if (productsError) {
          console.error('🚨 [ProductsStore]: Error loading products', productsError);
          patchState(store, {
            status: 'error',
            error: (productsError as Error).message,
          });
        }

        if (prices && stripeProducts) {
          {
            const products: StripeProductPublic[] = [];
  
            stripeProducts.forEach(product => {
              const { attrs, ...mainProperties } = product;
              products.push({
                ...mainProperties,
                images: (attrs as any)?.images,
                price_details: prices.find(price => price.product === product.id) || null
              });
            });
  
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
  withHooks({
    onInit(store) {
      console.log('🔍 [ProductsStore] initialized');
      // Automatically load products when the store is initialized
      //store.loadProducts();
    },
    onDestroy() {
      console.log('🧹 [ProductsStore] destroyed');
    }
  })
)