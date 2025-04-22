import { withState, signalStore, withComputed, patchState, withMethods, withHooks } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { StripeCustomer, StripePaymentIntent } from '../models/database.model';
import { parseSubscription, StripeSubscriptionPublic } from './subscriptions.store';
import { SupabaseClientService } from '../services/supabase-client.service';
import { ProductsStore } from './products.store';

export type CustomerStatus = 'idle' | 'loading' | 'success' | 'error';

export type StripePaymentIntentsPublic = Omit<StripePaymentIntent, 'attrs'> & {
  status: string;
  invoiceId: string;
  liveMode: boolean;
  confirmationMethod: string;
  paymentMethodId: string;
};

export type StripeCustomerPublic = Omit<StripeCustomer, 'attrs'>


export interface CustomerState {
  customer: {
    data: StripeCustomerPublic | null;
    status: CustomerStatus;
    error: string | null;
  };
  paymentIntents: {
    data: StripePaymentIntentsPublic[];
    status: CustomerStatus;
    error: string | null;
  };
  subscriptions: {
    data: StripeSubscriptionPublic[];
    status: CustomerStatus;
    error: string | null;
  };
}

const initialCustomerState: CustomerState = {
  customer: { 
    status: 'idle', 
    data: null,
    error: null 
  },
  paymentIntents: {
    data: [],
    status: 'idle',
    error: null,
  },
  subscriptions: {
    data: [], 
    status: 'idle',
    error: null,
  },
};


export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withState(initialCustomerState),
  withComputed((state) => ({
    isPaymentIntentsStatusLoading: computed(() => state.paymentIntents.status() === 'loading'),
    isPaymentIntentsStatusSuccess: computed(() => state.paymentIntents.status() === 'success'),
    isPaymentIntentsStatusError: computed(() => state.paymentIntents.status() === 'error'),
    isSubscriptionsStatusLoading: computed(() => state.subscriptions.status() === 'loading'),
    isSubscriptionsStatusSuccess: computed(() => state.subscriptions.status() === 'success'),
    isSubscriptionsStatusError: computed(() => state.subscriptions.status() === 'error'),
    hasSubscriptions: computed(() => state.subscriptions.data() !== null && state.subscriptions.data()!.length > 0),
    hasPaymentIntents: computed(() => state.paymentIntents.data() !== null && state.paymentIntents.data()!.length > 0),
    firstSubscription: computed(() => state.subscriptions.data()?.[0]),
    restSubscriptions: computed(() => state.subscriptions.data()?.slice(1)),
    isError: computed(() => state.paymentIntents.error()),
  })),
  withMethods((state, supabaseService = inject(SupabaseClientService), productsStore = inject(ProductsStore)) => ({
    /**
     * Load customer
     * @param customerEmail The customer email
     */
    async loadCustomer(customerEmail: string) {
      patchState(state, { customer: { status: 'loading', data: null, error: null } });

      const { data, error } = await supabaseService.getCustomerByEmail(customerEmail);
      const [customer] = data as StripeCustomerPublic[];

      if (error) {
        patchState(state, { customer: { error: error.message, status: 'error', data: null } });
      } else {
        
        if (customer) {
          this.loadPaymentIntents(customer.id as string);
          this.loadSubscriptions(customer.id as string);

          patchState(state, { customer: { data: customer, status: 'success', error: null } });
        } else {
          patchState(state, { customer: { data: null, status: 'error', error: 'no customer found' } });
        }

      }
    },

    /**
     * Load payment intents
     * @param customerId The customer ID
     */
    async loadPaymentIntents(customerId: string) {
      patchState(state, { paymentIntents: { status: 'loading', data: [], error: null } });

      const { data, error } = await supabaseService.getCustomerPaymentIntents(customerId);
      const paymentIntents = data?.map((paymentIntent) => parsePaymentIntent(paymentIntent));

      if (error) {
        patchState(state, { paymentIntents: { error: error.message, status: 'error', data: [] } });
      } else {
        patchState(state, { paymentIntents: { data: paymentIntents ?? [], status: 'success', error: null } });
      }
    },  

    /**
     * Load subscriptions
     * @param customerId The customer ID
     */
    async loadSubscriptions(customerId: string) {
      patchState(state, { subscriptions: { data: [], status: 'loading', error: null } });

      const { data, error } = await supabaseService.getCustomerSubscriptions(customerId);
      
      if (error) {
        patchState(state, { subscriptions: { error: error.message, status: 'error', data: [] } });
      } else {
        const subscriptions = data.map((subscription) => {
          const parsedSubscription = parseSubscription(subscription);
          
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

        console.log('🔍 [CustomerStore] subscriptions: ', subscriptions);
        
        patchState(state, { subscriptions: { data: subscriptions ?? [], status: 'success', error: null } });
      }
    },
  })),
  withHooks(() => {
    const productsStore = inject(ProductsStore);

    if (!productsStore.hasProducts()) {
      console.log('🔍 [CustomerStore] loading products...');
      productsStore.loadProducts();
    }

    return {
      onInit() {
        console.log('🔍 [CustomerStore] initialized');
      },
      onDestroy() {
        console.log('🧹 [CustomerStore] destroyed');
      }
    }
  })
);

export function parsePaymentIntent(paymentIntent: StripePaymentIntent): StripePaymentIntentsPublic {
  console.log('🔍 [CustomerStore] parsePaymentIntent: ', paymentIntent);

  const paymentIntentAttrs = paymentIntent.attrs as any;
  return {
    ...paymentIntent,
    status: paymentIntentAttrs.status,
    invoiceId: paymentIntentAttrs.invoice as string,
    liveMode: paymentIntentAttrs.livemode as boolean,
    confirmationMethod: paymentIntentAttrs.confirmation_method,
    paymentMethodId: paymentIntentAttrs.payment_method,
  };
}