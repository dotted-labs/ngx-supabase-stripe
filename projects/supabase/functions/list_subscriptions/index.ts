// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import Stripe from 'npm:stripe@17.7.0';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-02-24.acacia',
  httpClient: Stripe.createFetchHttpClient()
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get customer ID from auth context
    const auth = req.headers.get('Authorization')?.split(' ')[1];
    if (!auth) {
      throw new Error('No authorization header');
    }
    
    // Decode JWT to get user info (would need implementation based on your auth strategy)
    // For example purposes, we'll assume we can get a customer ID
    // const customerId = 'cus_example'; // Replace with actual customer ID retrieval logic
    
    //console.log('🔌 [list_subscriptions]: Listing subscriptions for customer', customerId);

    const subscriptions = await stripe.subscriptions.list({
      status: 'all'
    });

    console.log('🔌 [list_subscriptions]: Found', subscriptions.data.length, 'subscriptions');
    return new Response(JSON.stringify(subscriptions.data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error: unknown) {
    console.error('[❌ list_subscriptions error]: ', error);
    return new Response(JSON.stringify({
      error: 'An unknown error occurred'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/list_subscriptions' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json'

*/ 