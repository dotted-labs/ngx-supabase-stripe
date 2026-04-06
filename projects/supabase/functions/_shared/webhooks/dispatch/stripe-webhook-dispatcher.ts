import { emptyResponse } from '../../api.ts';
import type { StripeEventHandler, StripeWebhookHandlerContext } from './stripe-event-handler.ts';
import { checkoutSessionCompletedHandler } from './checkout-session-completed/checkout-session-completed-handler.ts';

const ignoredStripeEventHandler: StripeEventHandler = {
  execute(_ctx) {
    console.log('🔌 [stripe_webhook]: event type is not checkout.session.completed, skipping');
    return Promise.resolve(emptyResponse(200));
  },
};

const handlersByType = new Map<string, StripeEventHandler>([
  ['checkout.session.completed', checkoutSessionCompletedHandler],
  // TODO: add other event handlers here
]);

export function handleStripeWebhookEvent(ctx: StripeWebhookHandlerContext): Promise<Response> {
  const handler = handlersByType.get(ctx.event.type) ?? ignoredStripeEventHandler;
  return handler.execute(ctx);
}
