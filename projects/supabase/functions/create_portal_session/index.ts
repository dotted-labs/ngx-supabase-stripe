// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createPortalSession } from 'supabase-stripe-core/create-portal-session';

Deno.serve(async (req) => {
  try {
    const { customerId, returnUrl } = await req.json();

    return await createPortalSession(
      { customerId, returnUrl },
      req,
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

  } catch (error) {
    return error as Response;
  }
});