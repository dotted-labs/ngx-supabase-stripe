import { StripeEnvironmentConfig, PortalSessionParams } from '../../types';
import { createStripeInstance } from '../utils';
import { corsHeaders } from '../../shared/cors';

/**
 * Create a billing portal session
 * Replicates the logic from create_portal_session edge function
 */
export async function createPortalSession(
  params: PortalSessionParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = createStripeInstance(stripeConfig);
    const { customerId, returnUrl } = params;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    console.log('🔌 [createPortalSession]: Portal session created', session);

    return new Response(JSON.stringify(session.url), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('❌ [create_portal_session]: Error creating portal session:', error);
    
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
} 