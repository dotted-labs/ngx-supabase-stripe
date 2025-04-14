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
    const { subscriptionId, params } = await req.json();

    console.log('🔌 [resume_subscription]: Resuming subscription', subscriptionId, params);

    // Default to setting billing_cycle_anchor to 'now' if not specified
    const resumeParams = {
      billing_cycle_anchor: 'now',
      ...params
    };

    const subscription = await stripe.subscriptions.resume(
      subscriptionId, 
      resumeParams
    );

    console.log('🔌 [resume_subscription]: Subscription resumed', subscription.id);
    return new Response(JSON.stringify(subscription), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error: unknown) {
    console.error('[❌ resume_subscription error]: ', error);
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resume_subscription' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"subscriptionId":"sub_123456","params":{"proration_behavior":"create_prorations"}}'

*/ 