// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { getSessionStatus } from 'supabase-stripe-core/session-status';

Deno.serve(async (req) => {
  try {
    const { sessionId } = await req.json();
    
    return await getSessionStatus(
      { sessionId },
      req,
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

  } catch (error) {
    return error as Response;
  }
})