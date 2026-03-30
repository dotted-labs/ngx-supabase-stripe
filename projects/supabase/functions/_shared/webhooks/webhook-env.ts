import { jsonResponse } from '../api.ts';

export type StripeWebhookEnv = {
  webhookSecret: string;
  supabaseUrl: string;
  serviceRoleKey: string;
};

export function loadStripeWebhookEnv():
  | { ok: true; env: StripeWebhookEnv }
  | { ok: false; response: Response } {
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('[stripe_webhook] Missing STRIPE_WEBHOOK_SECRET');
    return {
      ok: false,
      response: jsonResponse({ error: 'Server misconfiguration' }, 500),
    };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[stripe_webhook] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return {
      ok: false,
      response: jsonResponse({ error: 'Server misconfiguration' }, 500),
    };
  }

  return { ok: true, env: { webhookSecret, supabaseUrl, serviceRoleKey } };
}
