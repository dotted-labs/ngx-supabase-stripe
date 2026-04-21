import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Currency } from '../models/currency.model';
import { StripePricePublic, StripeProductPublic } from '../models/product-public.model';
import { ProductsService } from '../services/products.service';

export type { StripePricePublic, StripeProductPublic } from '../models/product-public.model';

export type ProductsStatus = 'idle' | 'loading' | 'success' | 'error';

type ProductsState = {
  products: StripeProductPublic[] | null;
  prices: StripePricePublic[] | null;
  status: ProductsStatus;
  error: string | null;
  currency: Currency;
};

const initialProductsState: ProductsState = {
  products: null,
  prices: null,
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
    oneTimeproductsByCurrency: computed(
      () =>
        state
          .products()
          ?.filter((product) =>
            product.prices.some(
              (price) => price.details.type === 'one_time' && price.details.currency === state.currency(),
            ),
          ) || [],
    ),
    recurringProductsByCurrency: computed(
      () =>
        state
          .products()
          ?.filter((product) =>
            product.prices.some(
              (price) => price.details.type === 'recurring' && price.details.currency === state.currency(),
            ),
          ) || [],
    ),
    productsByCurrency: computed(
      () =>
        state
          .products()
          ?.filter((product) => product.prices.some((price) => price.details.currency === state.currency())) || [],
    ),
    hasProducts: computed(() => state.products() !== null && state.products()!.length > 0),
    isError: computed(() => state.error()),
  })),
  withMethods((store, productsService = inject(ProductsService)) => ({
    /**
     * Get products by IDs from the current loaded products
     */
    getProductsByIds(ids: string[]): StripeProductPublic[] {
      return store.products()?.filter((product) => product.id && ids.includes(product.id)) || [];
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
        const { data: products, error: productError } = await productsService.fetchProductById(id);

        if (productError) {
          console.error('🎮 [ProductsStore]: Error loading product', productError);
          patchState(store, { status: 'error', error: (productError as Error).message });
          return;
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
        const { data, error } = await productsService.fetchFullCatalog();

        if (error) {
          console.error('🎮 [ProductsStore]: Error loading catalog', error);
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
          return;
        }

        if (!data) {
          patchState(store, { status: 'success', prices: [], products: [] });
          return;
        }

        console.log('🎮 [ProductsStore] products: ', data.products);

        patchState(store, {
          status: 'success',
          prices: data.prices,
          products: data.products,
        });
      } catch (error) {
        patchState(store, {
          status: 'error',
          error: (error as Error).message,
        });
      }
    },

    async loadProductsByIds(ids: string[]) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { data: products, error: productsError } = await productsService.fetchProductsByIds(ids);

        if (productsError) {
          console.error('🎮 [ProductsStore]: Error loading products', productsError);
          patchState(store, { status: 'error', error: (productsError as Error).message });
          return;
        }

        console.log('🎮 [ProductsStore] products: ', products);

        patchState(store, {
          status: 'success',
          products,
        });
      } catch (error) {
        patchState(store, { status: 'error', error: (error as Error).message });
      }
    },

    /**
     * Reset the store to initial state
     */
    reset() {
      patchState(store, initialProductsState);
    },
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
    },
  })),
);
