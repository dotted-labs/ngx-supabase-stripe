import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { StripeSubscription } from '../models/database.model';
import { StripeClientService } from '../services/stripe-client.service';
import { SupabaseClientService } from '../services/supabase-client.service';

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
  sessionStatus: any | null;
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
  sessionStatus: null,
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
  withMethods((store, stripeService = inject(StripeClientService), supabaseService = inject(SupabaseClientService)) => ({
    /**
     * Create a subscription
     * @param priceId The price ID for the subscription
     */
    async createSubscription(priceId: string, returnPath: string) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { clientSecret, error } = await stripeService.createSubscription(priceId, returnPath);
        console.log('🔍 [SubscriptionsStore] created subscription', clientSecret, error);
        
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
              embeddedSubscription: embeddedCheckout
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
        console.log('🔍 [SubscriptionsStore] loaded subscriptions', subscriptions);

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
        console.log('🔍 [SubscriptionsStore] got subscription', subscription, error);

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
        console.log('🔍 [SubscriptionsStore] updated subscription', subscription, error);

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
        const { subscription: subscriptionCanceled, error: stripeError } = await stripeService.cancelSubscription(subscriptionId);

        console.log('🔍 [SubscriptionsStore] cancelled subscription', subscriptionCanceled, stripeError);

        if (stripeError) {
          return patchState(store, {
            status: 'error',
            error: (stripeError as Error).message,
          });
        }

        const { data, error: selectedSubscriptionError } = await supabaseService.selectStripeSubscription(subscriptionCanceled.id);
        const [selectedSubscription] = data || [];

        console.log('🔍 [SubscriptionsStore] selected subscription', selectedSubscription, selectedSubscriptionError);

        if (selectedSubscriptionError) {
          return patchState(store, {
            status: 'error',
            error: (selectedSubscriptionError as Error).message,
          });
        }

        if (selectedSubscription) {
          const subscriptions = store.subscriptions()?.map((subscription: StripeSubscription) => {
            if (subscription.id === subscriptionId) {
              return selectedSubscription;
            }
            return subscription;
          });

          patchState(store, {
            status: 'success',
            subscriptions: subscriptions as StripeSubscription[],
          });
        } else {
          return patchState(store, {
            status: 'error',
            error: 'No subscription found',
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
     * Resume a paused subscription
     * @param subscriptionId The subscription ID
     * @param params Optional parameters for resumption
     */
    async resumeSubscription(subscriptionId: string, params?: any) {
      patchState(store, { status: 'loading', error: null });

      try {
        const { subscription, error } = await stripeService.resumeSubscription(subscriptionId, params);
        console.log('🔍 [SubscriptionsStore] resumed subscription', subscription, error);

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
     * Get the status of a checkout subcription session
     * @param sessionId The ID of the checkout subcription session
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