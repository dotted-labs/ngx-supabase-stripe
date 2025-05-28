import { StripeEnvironmentConfig, SessionStatusParams } from '../../types';
import { createStripeInstance } from '../utils';
import { corsHeaders } from '../../shared/cors';

/**
 * Get checkout session status
 * Replicates the logic from session_status edge function
 */
export async function getSessionStatus(
  params: SessionStatusParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = createStripeInstance(stripeConfig);
    const { sessionId } = params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return new Response(JSON.stringify(session), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[❌ session_status error]: ', error);
    
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
} 