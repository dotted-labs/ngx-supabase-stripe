import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { StripeClientService } from '../services/stripe-client.service';

export interface PortalSessionResponse {
  url: string;
}

export type PortalStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PortalState {
  status: PortalStatus;
  error: string | null;
  portalUrl: string | null;
}

const initialPortalState: PortalState = {
  status: 'idle',
  error: null,
  portalUrl: null
};

export const PortalAccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialPortalState),
  withComputed((state) => ({
    isStatusIdle: computed(() => state.status() === 'idle'),
    isStatusLoading: computed(() => state.status() === 'loading'),
    isStatusSuccess: computed(() => state.status() === 'success'),
    isStatusError: computed(() => state.status() === 'error'),
  })),
  withMethods((store, stripeService = inject(StripeClientService)) => ({
    /**
     * Creates a customer portal session and redirects to the URL
     * @param customerId Stripe customer ID
     * @param returnUrl URL to redirect to after the portal session
     */
    async createPortalSession(customerId: string, returnUrl: string): Promise<void> {
      patchState(store, { status: 'loading', error: null, portalUrl: null });

      try {
        const { url, error } = await stripeService.createPortalSession(customerId, returnUrl);

        if (error) {
          throw new Error(error.message);
        }

        if (!url) {
          throw new Error($localize`:@@stripe.errors.portal_session_failed:Could not create portal session`);
        }

        patchState(store, {
          status: 'success',
          portalUrl: url
        });

        window.location.href = url;
      } catch (error) {
        console.error('🚨 [PortalAccountStore]', error);
        
        const errorMessage = error instanceof Error ? error.message : $localize`:@@stripe.errors.unknown:Unknown error`;
        
        patchState(store, {
          status: 'error',
          error: errorMessage
        });
      }
    },

    /**
     * Resets the store to initial state
     */
    reset(): void {
      patchState(store, initialPortalState);
    }
  }))
); 