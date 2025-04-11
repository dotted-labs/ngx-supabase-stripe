import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { StripeClientService } from '../services/stripe-client.service';
import { StripeSubscription } from '../models/database.model';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
/**
 * Status of the subscription process
 */
export type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Subscription state interface
 */
export interface SubscriptionState {
  subscriptions: StripeSubscription[] | null;
  embeddedSubscription: StripeEmbeddedCheckout | null;
  currentSubscription: StripeSubscription | null;
  status: SubscriptionStatus;
  error: string | null;
}

/**
 * Initial state for subscription store
 */
const initialSubscriptionState: SubscriptionState = {
  subscriptions: null,
  embeddedSubscription: null,
  currentSubscription: null,
  status: 'idle',
  error: null,
};

/**
 * Store for managing subscriptions state with NgRx Signals
 */
export const SubscriptionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialSubscriptionState),
  withComputed((state) => ({
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
    hasSubscriptions: computed(() => state.subscriptions() !== null && state.subscriptions()!.length > 0),
    isError: computed(() => state.error()),
    //hasActiveSubscription: computed(() => {
    //  if (!state.subscriptions()) return false;
    //  return state.subscriptions()!.some(sub => sub.status === 'active');
    //})
  })),
  withMethods((store, stripeService = inject(StripeClientService)) => ({
    /**
     * Create a subscription
     * @param priceId The price ID for the subscription
     */
    async createSubscription(priceId: string, returnPath: string) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { clientSecret, error } = await stripeService.createSubscription(priceId, returnPath);

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
              status: 'success'
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
     * Load all subscriptions for the current customer
     */
    async loadSubscriptions() {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscriptions, error } = await stripeService.listSubscriptions();

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            subscriptions
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
     * Get a specific subscription
     * @param subscriptionId The subscription ID
     */
    async getSubscription(subscriptionId: string) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscription, error } = await stripeService.getSubscription(subscriptionId);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            currentSubscription: subscription
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
     * Update a subscription
     * @param subscriptionId The subscription ID
     * @param params The parameters to update
     */
    async updateSubscription(subscriptionId: string, params: any) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscription, error } = await stripeService.updateSubscription(subscriptionId, params);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            currentSubscription: subscription
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
     * Cancel a subscription
     * @param subscriptionId The subscription ID
     */
    async cancelSubscription(subscriptionId: string) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscription, error } = await stripeService.cancelSubscription(subscriptionId);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            currentSubscription: subscription
          });
          
          // Refresh the list after cancellation
          await this.loadSubscriptions();
        }
      } catch (error) {
        patchState(store, {
          status: 'error',
          error: (error as Error).message,
        });
      }
    },

    /**
     * Resume a paused subscription
     * @param subscriptionId The subscription ID
     * @param params Optional parameters for resumption
     */
    async resumeSubscription(subscriptionId: string, params?: any) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscription, error } = await stripeService.resumeSubscription(subscriptionId, params);

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            currentSubscription: subscription
          });
          
          // Refresh the list after resumption
          await this.loadSubscriptions();
        }
      } catch (error) {
        patchState(store, {
          status: 'error',
          error: (error as Error).message,
        });
      }
    },

    /**
     * Destroy the embedded subscription
     */
    destroyEmbeddedSubscription() {
      console.log('🧹 [SubscriptionsStore] destroying embedded subscription', store.embeddedSubscription());
      store.embeddedSubscription()?.destroy();
      console.log('🧹 [SubscriptionsStore] destroyed embedded subscription', store.embeddedSubscription());
    },

    /**
     * Reset the store to initial state
     */
    reset() {
      patchState(store, initialSubscriptionState);
    }
  }))
); 