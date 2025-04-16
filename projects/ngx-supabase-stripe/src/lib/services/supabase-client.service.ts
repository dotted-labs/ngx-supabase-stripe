import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
import { SUPABASE_CONFIG } from '../config/supabase.config';
import { StripeCheckoutSession, StripePaymentIntent, StripeProduct, StripeTables, StripeUpdateType } from '../models/database.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private readonly config = inject(SUPABASE_CONFIG);
  private readonly client: SupabaseClient<Database>;

  constructor() {
    this.client = createClient<Database>(
      this.config.supabaseUrl,
      this.config.supabaseKey,
    );

    console.log('🚀 [SupabaseClientService]: this.client', this.client);
  } 

  /**
   * Get the Supabase client instance
   */
  public getClient(): SupabaseClient<Database> {
    return this.client;
  }

  /**
   * Select checkout sessions
   * @param query Optional query parameters
   */
  public async selectCheckoutSessions(
    query?: {
      columns?: string;
      eq?: Partial<Record<keyof StripeCheckoutSession, unknown>>;
      order?: { column: keyof StripeCheckoutSession | string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<{ data: StripeCheckoutSession[] | null; error: Error | null }> {
    return this.select<StripeCheckoutSession>('checkout_sessions', query);
  }

  /**
   * Select payment intents
   * @param query Optional query parameters
   */
  public async selectPaymentIntents(
    query?: {
      columns?: string;
      eq?: Partial<Record<keyof StripePaymentIntent, unknown>>;
      order?: { column: keyof StripePaymentIntent | string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<{ data: StripePaymentIntent[] | null; error: Error | null }> {
    return this.select<StripePaymentIntent>('payment_intents', query);
  }

  /**
   * STRIPE SUBSCRIPTIONS
   */

  /**
   * Get all Stripe subscriptions
   */
  public getStripeSubscriptions() {
    return this.client
      .schema('public')
      .rpc('get_stripe_subscriptions')
      .select('*');
  }

  /**
   * Select a Stripe subscription
   * @param subscriptionId The subscription ID
   */
  public selectStripeSubscription(subscriptionId: string) {
    return this.client
      .schema('public')
      .rpc('get_stripe_subscription', { subscription_id: subscriptionId })
      .select('*');
  }

  /**
   * STRIPE PRICES
   */

  /**
   * Select Stripe prices
   * @param query Optional query parameters
   */
  public async selectStripePrices() {
    return this.client
      .schema('public')
      .rpc('get_stripe_prices')
      .select('*');
  }

  
  /**
   * STRIPE PRODUCTS
  */

  /**
   * Select Stripe products
   * @param query Optional query parameters
   */
  public async selectStripeProducts() {
    return this.client
      .schema('public')
      .rpc('get_stripe_products')
      .select('*');
  }

  /**
   * Update a product
   * @param id The product ID
   * @param data The product data to update
   */
  public async updateProduct(
    id: string,
    data: StripeUpdateType<'products'>
  ): Promise<{ data: StripeProduct | null; error: Error | null }> {
    return this.update<StripeProduct>(
      'products',
      data,
      { id }
    );
  }

  /**
   * Delete a product
   * @param id The product ID
   */
  public async deleteProduct(
    id: string
  ): Promise<{ data: StripeProduct | null; error: Error | null }> {
    return this.delete<StripeProduct>('products', { id });
  }

  /**
   * CUSTOMER FUNCTIONS
  */

  /**
   * Get customer by email
   * @param email The customer email
   */
  public async getCustomerByEmail(email: string) {
    return this.client.schema('public').rpc('get_stripe_customer', { customer_email: email });
  }

  /**
   * Get customer payment intents
   * @param customerId The customer ID
   */
  public async getCustomerPaymentIntents(customerId: string) {
    return this.client
      .schema('public')
      .rpc('get_stripe_customer_payment_intents', { customer_id: customerId })
      .select('*');
  }

  /**
   * Get customer subscriptions
   * @param customerId The customer ID
   */
  public async getCustomerSubscriptions(customerId: string) {
    return this.client
      .schema('public')
      .rpc('get_stripe_customer_subscriptions', { customer_id: customerId })
      .select('*');
  }


  /**
   * CLIENT GENERIC FUNCTIONS
  */

  /**
   * Select data from a table
   * @param table The table name
   * @param query Optional query parameters
   */
  public async select<T>(
    table: StripeTables,
    query?: {
      columns?: string;
      eq?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<{ data: T[] | null; error: Error | null }> {
    try {
      let queryBuilder = this.client
        .schema('stripe')
        .from(table)
        .select(query?.columns ?? '*');

      if (query?.eq) {
        Object.entries(query.eq).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value);
        });
      }

      if (query?.order) {
        queryBuilder = queryBuilder.order(
          query.order.column,
          { ascending: query.order.ascending ?? true }
        );
      }

      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return { data: data as T[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Insert data into a table
   * @param table The table name
   * @param data The data to insert
   */
  public async insert<T>(
    table: StripeTables,
    data: Partial<T>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const { data: result, error } = await (this.client
        .schema('stripe')
        .from(table)
        .insert(data)
        .select()
        .single());

      if (error) {
        throw error;
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update data in a table
   * @param table The table name
   * @param data The data to update
   * @param eq The equality conditions
   */
  public async update<T>(
    table: StripeTables,
    data: Partial<T>,
    eq: Record<string, any>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      let queryBuilder = this.client
        .schema('stripe')
        .from(table)
        .update(data);

      Object.entries(eq).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });

      const { data: result, error } = await queryBuilder
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }


  /**
   * Delete data from a table
   * @param table The table name
   * @param eq The equality conditions
   */
  public async delete<T>(
    table: StripeTables,
    eq: Record<string, any>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      let queryBuilder = this.client
        .schema('stripe')
        .from(table)
        .delete();

      Object.entries(eq).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });

      const { data: result, error } = await queryBuilder
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}
