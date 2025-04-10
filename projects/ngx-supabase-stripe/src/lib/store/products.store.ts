import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { SupabaseClientService, StripeProduct } from '../services/supabase-client.service';

export type StripeProductPublic = Omit<StripeProduct, 'attrs'> & {
  images: string[];
}

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
        const { data, error } = await supabaseService.selectStripeProducts();

        console.log('🚀 [ProductsStore]: products', data);
        console.log('🚀 [ProductsStore]: error', error);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          const products: StripeProductPublic[] = [];

          data.forEach(product => {
            const { attrs, ...mainProperties } = product;

            products.push({
              ...mainProperties,
              images: (attrs as any)?.images
            });
          });

          //const transformProducts = (products: StripeProduct[]): StripeProductPublic[] => {
          //  return products.map(transformProduct);
          //};

          console.log('🚀 [ProductsStore]: products parsed with images', products);

          patchState(store, {
            status: 'success',
            products: products
          });
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