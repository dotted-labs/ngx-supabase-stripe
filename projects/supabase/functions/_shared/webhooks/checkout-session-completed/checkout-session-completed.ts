import Stripe from 'stripe';
import { createStripeInstance } from '../../stripe-core/utils.ts';
import type { StripeEnvironmentConfig } from '../../stripe-core/types.ts';

export type StripeLineItemGrant = {
  stripe_product_id: string;
  quantity: number;
};

export type CheckoutCompletedRpcPayload = {
  supabaseUserId: string | null;
  lineItems: StripeLineItemGrant[];
  sessionId: string;
  mode: string;
  subscriptionId: string | null;
  customerId: string | null;
};

function parseUserId(session: Stripe.Checkout.Session): string | null {
  const raw =
    session.metadata?.supabase_user_id ?? session.client_reference_id ?? null;
  if (!raw || typeof raw !== 'string') {
    return null;
  }
  return raw.trim();
}

function productIdFromLine(line: Stripe.LineItem): string | null {
  const price = line.price;
  if (!price || typeof price === 'string') {
    return null;
  }
  const product = price.product;
  console.log('🔌 [buildCheckoutCompletedPayload]: Product:', product);
  if (typeof product === 'string') {
    console.log('🔌 [buildCheckoutCompletedPayload]: Product is a string:', product);
    return product.startsWith('prod_') ? product : null;
  }
  if (product && typeof product === 'object' && 'id' in product) {
    console.log('🔌 [buildCheckoutCompletedPayload]: Product is an object:', product);
    const id = (product as Stripe.Product).id;
    return typeof id === 'string' && id.startsWith('prod_') ? id : null;
  }
  console.log('🔌 [buildCheckoutCompletedPayload]: Product is null:', product);
  return null;
}

/**
 * Loads full line items (with expanded price → product) and builds the RPC payload.
 */
export async function buildCheckoutCompletedPayload(
  stripeConfig: StripeEnvironmentConfig,
  sessionFromEvent: Stripe.Checkout.Session,
): Promise<CheckoutCompletedRpcPayload> {
  const stripe = createStripeInstance(stripeConfig);
  const sessionId =
    typeof sessionFromEvent.id === 'string' ? sessionFromEvent.id : null;

  console.log('🔌 [buildCheckoutCompletedPayload]: Session ID:', sessionId);

  if (!sessionId) {
    return {
      supabaseUserId: null,
      lineItems: [],
      sessionId: '',
      mode: 'unknown',
      subscriptionId: null,
      customerId: null,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product'],
  });

  const lineItems: StripeLineItemGrant[] = [];
  const data = session.line_items?.data ?? [];
  for (const line of data) {
    const stripeProductId = productIdFromLine(line);
    if (!stripeProductId) {
      continue;
    }
    const quantity = typeof line.quantity === 'number' && line.quantity > 0
      ? line.quantity
      : 1;
    lineItems.push({ stripe_product_id: stripeProductId, quantity });
  }

  const sub = session.subscription;
  const subscriptionId =
  typeof sub === 'string'
  ? sub
  : sub && typeof sub === 'object' && 'id' in sub
  ? String((sub as Stripe.Subscription).id)
  : null;

  const cust = session.customer;
  const customerId =
    typeof cust === 'string'
      ? cust
      : cust && typeof cust === 'object' && 'id' in cust
        ? String((cust as Stripe.Customer).id)
        : null;

  return {
    supabaseUserId: parseUserId(session),
    lineItems,
    sessionId,
    mode: session.mode ?? 'unknown',
    subscriptionId,
    customerId,
  };
}
