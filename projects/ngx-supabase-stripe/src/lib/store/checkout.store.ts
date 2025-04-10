import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { StripeClientService } from '../services/stripe-client.service';

/**
 * Status of the checkout process
 */
export type CheckoutStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Main state interface for checkout store
 */
type CheckoutState = {
  // The embedded checkout instance
  embeddedCheckout: StripeEmbeddedCheckout | null;
  // The current status of the checkout process
  status: CheckoutStatus;
  // The ID of the current checkout session
  sessionId: string | null;
  // Return page path
  returnPagePath: string;
  // Error message if any
  error: string | null;
  // Session details from Stripe
  sessionStatus: any | null;
}

/**
 * Initial state for checkout store
 */
const initialCheckoutState: CheckoutState = {
  embeddedCheckout: null,
  status: 'idle',
  sessionId: null,
  returnPagePath: '/return',
  error: null,
  sessionStatus: null
};

/**
 * Store for managing checkout state with NgRx Signals
 */
export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialCheckoutState),
  withComputed((state) => ({
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
    paymentStatus: computed(() => state.sessionStatus()?.status),
    isPaymentComplete: computed(() => state.sessionStatus()?.status === 'complete'),
    isPaymentProcessing: computed(() => state.sessionStatus()?.status === 'open'),
    isError: computed(() => state.error())
  })),
  withMethods((store, stripeService = inject(StripeClientService)) => ({
    /**
     * Create a checkout session
     * @param priceId The price ID to checkout
     * @param returnPagePath The return page path after checkout
     */
    async createCheckoutSession({priceId, returnPagePath}: {priceId: string, returnPagePath: string}) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { clientSecret, error } = await stripeService.createCheckoutSession(priceId, returnPagePath);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          const stripe = await stripeService.getStripe();

          if (!stripe) {
            patchState(store, {
              status: 'error',
              error: 'No Stripe instance returned',
            });
          } else {
            const embeddedCheckout = await stripe.initEmbeddedCheckout({ 
              clientSecret: clientSecret as string
            });
            
            embeddedCheckout?.mount('#embedded-checkout');

            patchState(store, {
              status: 'success',
              embeddedCheckout
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
     * Get the status of a checkout session
     * @param sessionId The ID of the checkout session
     */
    async getSessionStatus({sessionId}: {sessionId: string}) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { sessionStatus, error } = await stripeService.getCheckoutSessionStatus(sessionId);
      
        if (error) {
          patchState(store, { status: 'error', error: (error as Error).message });
        } else {
          patchState(store, { status: 'success', sessionStatus });
        }

      } catch (error) {
        patchState(store, { status: 'error', error: (error as Error).message });
      }
    },


    /**
     * Destroy the embedded checkout
     */
    destroyEmbeddedCheckout() {
      console.log('🧹 [CheckoutStore] destroying embedded checkout', store.embeddedCheckout());
      store.embeddedCheckout()?.destroy();
      console.log('🧹 [CheckoutStore] destroyed embedded checkout', store.embeddedCheckout());
    },
    
    /**
     * Reset the store to initial state
     */
    reset() {
      patchState(store, initialCheckoutState);
    }
  })),
  withHooks({
    onInit() {
      console.log('🔍 [CheckoutStore] initialized');
    },
    onDestroy(store) {
      store.embeddedCheckout()?.destroy();
      console.log('🧹 [CheckoutStore] destroyed');
    }
  })
) 