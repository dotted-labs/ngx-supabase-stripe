import { emptyResponse, jsonResponse } from '../../api.ts';
import type { StripeCheckoutRpcResult } from './checkout-session-completed-rpc.ts';

export type CheckoutGrantRpcContext = {
  stripeEventId: string;
  sessionId: string;
  supabaseUserId: string;
};

export type CheckoutGrantRpcOutcome = {
  data: StripeCheckoutRpcResult | null;
  error: Error | null;
};

/**
 * Maps RPC outcome to logs and HTTP response for checkout grant (SRP: no webhook orchestration here).
 */
export function handleCheckoutGrantRpcResult(
  outcome: CheckoutGrantRpcOutcome,
  context: CheckoutGrantRpcContext,
): Response {
  const { error, data } = outcome;

  if (error) {
    console.error('[stripe_webhook] RPC error:', error.message, {
      stripe_event_id: context.stripeEventId,
      session_id: context.sessionId,
    });
    return jsonResponse({ error: 'Database error' }, 500);
  }

  const summary = data ?? {};

  if (summary['user_found'] === false) {
    console.warn('[stripe_webhook] user not in public.user', {
      stripe_event_id: context.stripeEventId,
      session_id: context.sessionId,
      user_id: context.supabaseUserId,
      ...summary,
    });
  } else if (
    Array.isArray(summary['skipped_products']) &&
    (summary['skipped_products'] as unknown[]).length > 0
  ) {
    console.warn('[stripe_webhook] some Stripe products had no DB match', {
      stripe_event_id: context.stripeEventId,
      session_id: context.sessionId,
      ...summary,
    });
  } else {
    console.log('[stripe_webhook] checkout grant summary', {
      stripe_event_id: context.stripeEventId,
      session_id: context.sessionId,
      ...summary,
    });
  }

  return emptyResponse(200);
}
