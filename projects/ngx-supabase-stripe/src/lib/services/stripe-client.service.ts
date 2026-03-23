import { inject, Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import type { Stripe as StripeTypes } from 'stripe';
import type { FunctionInvokeOptions } from '@supabase/supabase-js';
import { STRIPE_CONFIG } from '../config/stripe.config';
import { StripeCustomerPublic } from '../store/customer.store';
import { SupabaseClientService } from './supabase-client.service';

type FunctionsAuthResult =
  | { ok: true; headers: { Authorization: string } }
  | { ok: false; error: Error };

@Injectable({
  providedIn: 'root',
})
export class StripeClientService {
  private readonly config = inject(STRIPE_CONFIG);
  private readonly supabase = inject(SupabaseClientService);
  stripe: Promise<Stripe | null>;
  embeddedCheckout: StripeEmbeddedCheckout | null = null;

  constructor() {
    this.stripe = loadStripe(this.config.publishableKey);
    console.log('🔌 [StripeClientService]: Loaded Stripe Client from @stripe/stripe-js');
  }

  /**
   * Edge functions use JWT verification (e.g. getClaims). Requires a logged-in Supabase Auth user.
   */
  private async resolveFunctionsAuth(): Promise<FunctionsAuthResult> {
    const client = this.supabase.getClient();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      return { ok: false, error: new Error(sessionError.message) };
    }

    let accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      const { data: refreshed, error: refreshError } = await client.auth.refreshSession();
      if (refreshError) {
        return { ok: false, error: new Error(refreshError.message) };
      }
      accessToken = refreshed.session?.access_token;
    }

    if (!accessToken) {
      return {
        ok: false,
        error: new Error(
          'No Supabase Auth session. Sign in before checkout (e.g. signInWithPassword, signInWithOAuth, or magic link).',
        ),
      };
    }

    return { ok: true, headers: { Authorization: `Bearer ${accessToken}` } };
  }

  private async invokeWithAuth<T>(
    name: string,
    options: FunctionInvokeOptions = {},
  ): Promise<{ data: T | null; error: Error | null }> {
    const auth = await this.resolveFunctionsAuth();
    if (!auth.ok) {
      return { data: null, error: auth.error };
    }

    const { data, error } = await this.supabase.getClient().functions.invoke<T>(name, {
      ...options,
      headers: {
        ...options.headers,
        ...auth.headers,
      },
    });

    if (error) {
      return { data: null, error: error as Error };
    }

    return { data, error: null };
  }

  /**
   * Get the Stripe instance
   */
  public async getStripe(): Promise<Stripe | null> {
    return this.stripe;
  }

  /**
   * Initialize the embedded checkout
   * @param clientSecret The client secret for the checkout session
   * @see https://docs.stripe.com/js/embedded_checkout/init - v8 supports optional appearance, defaultValues, etc.
   */
  public async initEmbeddedCheckout(clientSecret: string) {
    const stripe = await this.getStripe();
    this.embeddedCheckout = await stripe?.initEmbeddedCheckout({ 
      clientSecret
    }) ?? null;
  }

  /**
   * Mount the embedded checkout
   * @param elementId The ID of the element to mount the checkout on
   */
  public mountEmbeddedCheckout(elementId: string = '#embedded-checkout') {
    this.embeddedCheckout?.mount(elementId);
  }

  /**
   * Destroy the embedded checkout
   * Wrapped in try/catch to handle multiple destroy() calls (stripe-js throws IntegrationError when instance already destroyed)
   */
  public destroyEmbeddedCheckout() {
    if (!this.embeddedCheckout) return;
    try {
      this.embeddedCheckout.destroy();
    } catch {
      // Already destroyed or error - ignore silently
    } finally {
      this.embeddedCheckout = null;
    }
  }

  /**
   * Create a checkout session
   * @param priceId The price ID for the subscription
   * @param successUrl The URL to redirect to on success
   * @param cancelUrl The URL to redirect to on cancel
   */
  public async createCheckoutSession(
    priceId: string,
    resultPagePath: string,
    customer: StripeCustomerPublic | null
  ): Promise<{ clientSecret: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Checkout.Session>('checkout_session', {
        body: {
          priceId,
          resultPagePath,
          customer,
        },
      });

      if (error) {
        throw error;
      }

      return {
        clientSecret: data?.client_secret ?? null,
        error: null,
      };
    } catch (error) {
      return { clientSecret: null, error: error as Error };
    }
  }

  /**
   * Create a subscription
   * @param priceId The price ID for the subscription
   */
  public async createSubscription(priceId: string, returnPath: string, customer: StripeCustomerPublic | null): Promise<{ clientSecret: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Checkout.Session>('create_subscription', {
        body: {
          priceId,
          resultPagePath: returnPath,
          customer,
        },
      });

      if (error) {
        throw error;
      }

      return { clientSecret: data?.client_secret ?? null, error: null };
    } catch (error) {
      return { clientSecret: null, error: error as Error };
    }
  }

  /**
   * Update a subscription
   * @param subscriptionId The subscription ID 
   * @param params The parameters to update
   */
  public async updateSubscription(
    subscriptionId: string, 
    params: any
  ): Promise<{ subscription: StripeTypes.Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Subscription>('update_subscription', {
        body: {
          subscriptionId,
          params,
        },
      });

      if (error) {
        throw error;
      }

      return { subscription: data, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  }

  /**
   * Get a subscription
   * @param subscriptionId The subscription ID
   */
  public async getSubscription(
    subscriptionId: string
  ): Promise<{ subscription: StripeTypes.Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Subscription>('get_subscription', {
        body: {
          subscriptionId,
        },
      });

      if (error) {
        throw error;
      }

      return { subscription: data, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  }

  /**
   * List customer subscriptions
   */
  public async listSubscriptions(): Promise<{ subscriptions: StripeTypes.Subscription[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Subscription[]>('list_subscriptions');

      if (error) {
        throw error;
      }

      return { subscriptions: data, error: null };
    } catch (error) {
      return { subscriptions: null, error: error as Error };
    }
  }

  /**
   * Cancel a subscription
   * @param subscriptionId The subscription ID
   */
  public async cancelSubscription(
    subscriptionId: string
  ): Promise<{ subscription: StripeTypes.Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Subscription>('cancel_subscription', {
        body: {
          subscriptionId,
        },
      });

      if (error) {
        throw error;
      }

      return { subscription: data, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  }

  /**
   * Resume a paused subscription
   * @param subscriptionId The subscription ID
   * @param params Optional parameters for resumption
   */
  public async resumeSubscription(
    subscriptionId: string,
    params?: any
  ): Promise<{ subscription: StripeTypes.Subscription | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Subscription>('resume_subscription', {
        body: {
          subscriptionId,
          params,
        },
      });

      if (error) {
        throw error;
      }

      return { subscription: data, error: null };
    } catch (error) {
      return { subscription: null, error: error as Error };
    }
  }

  /**
   * Retrieve the payment intent status
   * @param sessionId The session ID of the checkout session
   */
  public async getCheckoutSessionStatus(sessionId: string): Promise<{ 
    sessionStatus: StripeTypes.Checkout.Session | null; 
    error: Error | null 
  }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Checkout.Session>('session_status', {
        body: {
          sessionId,
        },
      });

      if (error) {
        throw error;
      }

      return { sessionStatus: data, error: null };
    } catch (error) {
      console.error('❌ [StripeClientService]: Error retrieving payment intent:', error);
      return { sessionStatus: null, error: error as Error };
    }
  }

  /**
   * Create a portal session
   * @param customerId The customer ID
   * @param returnUrl The URL to redirect to after the portal session
   */
  public async createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.BillingPortal.Session>('create_portal_session', {
        body: {
          customerId,
          returnUrl,
        },
      });

      if (error) {
        throw error;
      }

      return { url: data?.url ?? null, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }

  /**
   * Create a customer
   * @param customerEmail The email of the customer
   */
  public async createCustomer(customerEmail: string): Promise<{ customer: StripeTypes.Customer | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.Customer>('create_customer', {
        body: {
          customerEmail,
        },
      });

      if (error) {
        throw error;
      }

      return { customer: data, error: null };
    } catch (error) {
      return { customer: null, error: error as Error };
    }
  }

  public async getCustomerPaymentMethods(customerId: string): Promise<{ paymentMethods: StripeTypes.PaymentMethod[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.PaymentMethod[]>('customer_payment_methods', {
        body: { customerId },
      });

      if (error) {
        throw error;
      }

      return { paymentMethods: data, error: null };
    } catch (error) {
      return { paymentMethods: null, error: error as Error };
    }
  }

  public async getCustomerPaymentMethod(customerId: string, paymentMethodId: string): Promise<{ paymentMethod: StripeTypes.PaymentMethod | null; error: Error | null }> {
    try {
      const { data, error } = await this.invokeWithAuth<StripeTypes.PaymentMethod>('customer_payment_method', {
        body: { customerId, paymentMethodId },
      });

      if (error) {
        throw error;
      }

      return { paymentMethod: data, error: null };
    } catch (error) {
      return { paymentMethod: null, error: error as Error };
    }
  }
}
