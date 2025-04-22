import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { StripeSubscription } from '../models/database.model';
import { StripeClientService } from '../services/stripe-client.service';
import { SupabaseClientService } from '../services/supabase-client.service';
import { ProductsStore, StripeProductPublic } from './products.store';
import { CustomerStore, StripeCustomerPublic } from './customer.store';

export type StripeSubscriptionCancellationDetails = {
  cancel_at_period_end: boolean;
  cancel_at: number;
  canceled_at: number;
  cancellation_details: {
    comment: string;
    feedback: string;
    reason: string;
  }
}

export type StripeSubscriptionPlan = {
  amount: number;
  active: boolean;
  interval: string;
  productId: string;
}

export type StripeSubscriptionPublic = Omit<StripeSubscription, 'attrs'> & {
  status: string;
  plan: StripeSubscriptionPlan;
  cancel: StripeSubscriptionCancellationDetails;
  product?: StripeProductPublic | null;
};

export type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SubscriptionState {
  subscriptions: StripeSubscriptionPublic[] | null;
  embeddedSubscription: StripeEmbeddedCheckout | null;
  currentSubscription: StripeSubscriptionPublic | null;
  status: SubscriptionStatus;
  error: string | null;
  sessionStatus: any | null;
}

const initialSubscriptionState: SubscriptionState = {
  subscriptions: null,
  embeddedSubscription: null,
  currentSubscription: null,
  status: 'idle',
  error: null,
  sessionStatus: null,
};

export const SubscriptionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialSubscriptionState),
  withComputed((state) => ({
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
    hasSubscriptions: computed(() => state.subscriptions() !== null && state.subscriptions()!.length > 0),
    isError: computed(() => state.error()),
  })),
  withMethods((store, stripeService = inject(StripeClientService), 
               supabaseService = inject(SupabaseClientService), 
               productsStore = inject(ProductsStore),
               customerStore = inject(CustomerStore)) => ({
    /**
     * Create a subscription
     * @param priceId The price ID for the subscription
     */
    async createSubscription(priceId: string, returnPath: string, customerEmail: string | null) {
      patchState(store, { status: 'loading', error: null });

      try {
        let customer: StripeCustomerPublic | null = null;

        if (customerEmail) {
          customer = customerStore.customer().data;
        }

        const { clientSecret, error } = await stripeService.createSubscription(priceId, returnPath, customer);
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
        const { data: subscriptions, error } = await supabaseService.getStripeSubscriptions();
        console.log('🔍 [SubscriptionsStore] loaded subscriptions', subscriptions);

        const parsedSubscriptions = subscriptions?.map((subscription) => {
          const parsedSubscription = parseSubscription(subscription as StripeSubscription);
          
          // Get the product associated with this subscription
          const productId = parsedSubscription.plan.productId;
          if (productId && productsStore.products()) {
            const product = productsStore.products()?.find(p => p.id === productId);
            if (product) {
              parsedSubscription.product = product;
            }
          }
          
          return parsedSubscription;
        });

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            subscriptions: parsedSubscriptions
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
        const { data, error } = await supabaseService.selectStripeSubscription(subscriptionId);
        const [subscription] = data || [];
        console.log('🔍 [SubscriptionsStore] got subscription', subscription, error);

        const parsedSubscription = parseSubscription(subscription as StripeSubscription);

        // Get the product associated with this subscription
        const productId = parsedSubscription.plan.productId;
        if (productId && productsStore.products()) {
          const product = productsStore.products()?.find(p => p.id === productId);
          if (product) {
            parsedSubscription.product = product;
          }
        }

        if (error) {
          patchState(store, {
            status: 'error',
            error: (error as Error).message,
          });
        } else {
          patchState(store, {
            status: 'success',
            currentSubscription: parsedSubscription
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
  })),
  withHooks(() => {
    const productsStore = inject(ProductsStore);

    if (!productsStore.hasProducts()) {
      productsStore.loadProducts();
      console.log('🔍 [SubscriptionsStore] loading products');
    }

    return {
      onInit() {
        console.log('🔍 [SubscriptionsStore] initialized');
      },
      onDestroy() {
        console.log('🧹 [SubscriptionsStore] destroyed');
      }
    }
  })
);

export function parseSubscription(subscription: StripeSubscription): StripeSubscriptionPublic {
  const subscriptionAttrs = subscription.attrs as any;
  
  return {
    ...subscription,
    status: subscriptionAttrs.status,
    plan: {
      amount: subscriptionAttrs.plan.amount,
      active: subscriptionAttrs.plan.active,
      interval: subscriptionAttrs.plan.interval,
      productId: subscriptionAttrs.plan.product,
    },
    cancel: {
      cancel_at_period_end: subscriptionAttrs.cancel_at_period_end ?? false,
      cancel_at: subscriptionAttrs.cancel_at ?? null,
      canceled_at: subscriptionAttrs.canceled_at ?? null,
      cancellation_details: subscriptionAttrs.cancellation_details ?? {
        comment: null,
        feedback: null,
        reason: null
      }
    },
    product: subscriptionAttrs.product ? subscriptionAttrs.product as StripeProductPublic : undefined
  };
}