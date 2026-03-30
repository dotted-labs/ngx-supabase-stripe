import { createClient } from '@supabase/supabase-js';
import type { StripeLineItemGrant } from './checkout-session-completed.ts';

export type StripeCheckoutRpcResult = Record<string, unknown>;

export async function invokeStripeCheckoutCompletedRpc(params: {
  supabaseUrl: string;
  serviceRoleKey: string;
  supabaseUserId: string;
  stripeEventId: string;
  lineItems: StripeLineItemGrant[];
  sessionId: string;
  mode: string;
  subscriptionId: string | null;
  customerId: string | null;
}): Promise<{ data: StripeCheckoutRpcResult | null; error: Error | null }> {
  const supabase = createClient(params.supabaseUrl, params.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('stripe_checkout_completed', {
    p_supabase_user_id: params.supabaseUserId,
    p_stripe_event_id: params.stripeEventId,
    p_line_items: params.lineItems.length > 0 ? params.lineItems : [],
    p_session_id: params.sessionId,
    p_mode: params.mode,
    p_subscription_id: params.subscriptionId,
    p_customer_id: params.customerId,
  });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return {
    data: data as StripeCheckoutRpcResult,
    error: null,
  };
}
