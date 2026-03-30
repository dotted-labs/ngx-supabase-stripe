export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const APIResponse = <T>(response: T, status: number = 200) => {
  return new Response(JSON.stringify(response), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    status
  });
};

/** JSON body without CORS — server-to-server (e.g. Stripe webhooks). */
export function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function emptyResponse(status: number): Response {
  return new Response(null, { status });
}