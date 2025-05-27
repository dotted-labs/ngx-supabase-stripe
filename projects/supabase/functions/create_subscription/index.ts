// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createSubscription } from 'supabase-stripe-core';

Deno.serve(async (req: Request) => {
  try {
    const { priceId, resultPagePath, customer } = await req.json();

    return await createSubscription(
      { priceId, resultPagePath, customer },
      req,
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

  } catch (error) {
    return error as Response;
  }
});
