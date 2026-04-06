import type Stripe from 'stripe';

/**
 * Context passed to each Stripe webhook handler after signature verification.
 */
export type StripeWebhookHandlerContext = {
  event: Stripe.Event;
  supabaseUrl: string;
  serviceRoleKey: string;
};

export interface StripeEventHandler {
  execute(ctx: StripeWebhookHandlerContext): Promise<Response>;
}
