import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { APIResponse, corsHeaders } from './api.ts';

/**
 * Publishable / anon key: SB_PUBLISHABLE_KEY if using new API keys (set as secret),
 * otherwise SUPABASE_ANON_KEY (injected by Supabase for Edge Functions).
 */
function getSupabasePublishableKey(): string | undefined {
  return Deno.env.get('SB_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? undefined;
}

let authClient: SupabaseClient | null = null;

function getAuthClient(): SupabaseClient {
  if (!authClient) {
    const url = Deno.env.get('SUPABASE_URL');
    const key = getSupabasePublishableKey();
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY / SB_PUBLISHABLE_KEY');
    }
    authClient = createClient(url, key);
  }
  return authClient;
}

export function getBearerToken(req: Request): string | null {
  const h = req.headers.get('Authorization');
  if (!h?.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  const token = h.slice(7).trim();
  return token || null;
}

export type VerifiedAuth =
  | { ok: true; claims: Record<string, unknown> }
  | { ok: false; response: Response };

/**
 * Verifies the request JWT via Supabase Auth (JWKS / server validation per project settings).
 * @see https://supabase.com/docs/guides/functions/auth#verifying-jwt
 */
export async function verifyJwt(req: Request): Promise<VerifiedAuth> {
  const token = getBearerToken(req);
  if (!token) {
    return {
      ok: false,
      response: APIResponse({ msg: 'Missing or invalid Authorization header' }, 401),
    };
  }

  let supabase: SupabaseClient;
  try {
    supabase = getAuthClient();
  } catch {
    return {
      ok: false,
      response: APIResponse({ msg: 'Authentication is not configured' }, 500),
    };
  }

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || data?.claims == null) {
    return {
      ok: false,
      response: APIResponse({ msg: 'Invalid JWT' }, 401),
    };
  }

  return { ok: true, claims: data.claims as Record<string, unknown> };
}

/**
 * OPTIONS skips auth. All other methods require a valid Bearer JWT.
 */
export function serveWithAuth(
  handler: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const auth = await verifyJwt(req);
    if (!auth.ok) {
      return auth.response;
    }

    return handler(req);
  };
}
