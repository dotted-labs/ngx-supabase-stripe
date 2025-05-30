import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { StripeClientService } from '../services/stripe-client.service';
import { CustomerStore, StripeCustomerPublic } from './customer.store';

export type CheckoutStatus = 'idle' | 'loading' | 'success' | 'error';

type CheckoutState = {
  status: CheckoutStatus;
  sessionId: string | null;
  returnPagePath: string;
  error: string | null;
  sessionStatus: any | null;
}

const initialCheckoutState: CheckoutState = {
  status: 'idle',
  sessionId: null,
  returnPagePath: '/return',
  error: null,
  sessionStatus: null
};

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
  withMethods((store, stripeService = inject(StripeClientService), customerStore = inject(CustomerStore)) => ({
    /**
     * Create a checkout session
     * @param priceId The price ID to checkout
     * @param returnPagePath The return page path after checkout
     */
    async createCheckoutSession({priceId, returnPagePath, customerEmail}: {priceId: string, returnPagePath: string, customerEmail: string | null}) {
      patchState(store, { status: 'loading', error: null });

      try {
        let customer: StripeCustomerPublic | null = null;
        
        if (customerEmail) {
          customer = customerStore.customer().data;
        }

        const { clientSecret, error } = await stripeService.createCheckoutSession(priceId, returnPagePath, customer);

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
            await stripeService.initEmbeddedCheckout(clientSecret as string);
            stripeService.mountEmbeddedCheckout();

            patchState(store, {
              status: 'success',
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
      stripeService.destroyEmbeddedCheckout();
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
    onDestroy() {
      console.log('🧹 [CheckoutStore] destroyed');
    }
  })
) 