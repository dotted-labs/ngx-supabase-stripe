import { Injectable, inject } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe.config';
import { SupabaseClientService } from './supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class StripeClientService {
  private readonly config = inject(STRIPE_CONFIG);
  private readonly supabase = inject(SupabaseClientService);
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = loadStripe(this.config.publishableKey);
    console.log('🔌 [StripeClientService]: Loaded Stripe Client from @stripe/stripe-js');
  }

  /**
   * Get the Stripe instance
   */
  public async getStripe(): Promise<Stripe | null> {
    return this.stripe;
  }

  /**
   * Create a checkout session
   * @param priceId The price ID for the subscription
   * @param successUrl The URL to redirect to on success
   * @param cancelUrl The URL to redirect to on cancel
   */
  public async createCheckoutSession(
    priceId: string,
    resultPagePath: string
  ): Promise<{ clientSecret: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('checkout_session', {
          body: {
            priceId,
            resultPagePath
          }
        });

      if (error) {
        throw error;
      }

      return { clientSecret: data.clientSecret, error: null };
    } catch (error) {
      return { clientSecret: null, error: error as Error };
    }
  }

  /**
   * Create a subscription
   * @param priceId The price ID for the subscription
   */
  public async createSubscription(priceId: string, returnPath: string): Promise<{ clientSecret: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('create_subscription', {
          body: {
            priceId,
            resultPagePath: returnPath
          }
        });

      if (error) {
        throw error;
      }

      return { clientSecret: data.clientSecret, error: null };
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
  ): Promise<{ subscription: any | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('update_subscription', {
          body: {
            subscriptionId,
            params
          }
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
  ): Promise<{ subscription: any | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('get_subscription', {
          body: {
            subscriptionId
          }
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
  public async listSubscriptions(): Promise<{ subscriptions: any[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('list_subscriptions');

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
  ): Promise<{ subscription: any | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('cancel_subscription', {
          body: {
            subscriptionId
          }
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
  ): Promise<{ subscription: any | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('resume_subscription', {
          body: {
            subscriptionId,
            params
          }
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
    sessionStatus: any | null; 
    error: Error | null 
  }> {
    try {
      const { data, error } = await this.supabase.getClient()
        .functions.invoke('session_status', {
          body: {
            sessionId
          }
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
   * Get customer subscriptions
   */
  //public async getSubscriptions(): Promise<{ data: any[] | null; error: Error | null }> {
  //  try {
  //    const { data, error } = await this.supabase.getClient()
  //      .functions.invoke('get-subscriptions');

  //    if (error) {
  //      throw error;
  //    }

  //    return { data, error: null };
  //  } catch (error) {
  //    return { data: null, error: error as Error };
  //  }
  //}

  /**
   * Get available products and prices
   */
  //public async getProducts(): Promise<{ data: any[] | null; error: Error | null }> {
  //  try {
  //    const { data, error } = await this.supabase.getClient()
  //      .functions.invoke('stripe-products');

  //    if (error) {
  //      throw error;
  //    }

  //    return { data, error: null };
  //  } catch (error) {
  //    return { data: null, error: error as Error };
  //  }
  //}
}
