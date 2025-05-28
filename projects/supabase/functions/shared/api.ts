export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const APIResponse = <T>(data: T, status: number = 200) => {
  return new Response(JSON.stringify({ ...data }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    status
  });
}