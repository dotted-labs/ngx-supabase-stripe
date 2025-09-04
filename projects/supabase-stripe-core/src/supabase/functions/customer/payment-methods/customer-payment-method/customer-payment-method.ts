import Stripe from 'stripe';
import { StripeEnvironmentConfig, SupabaseStripeResponse } from '../../../../types';
import { createStripeInstance } from '../../../utils';

export type StripeCustomerPaymentMethod = SupabaseStripeResponse<Stripe.PaymentMethod>;

export interface CustomerPaymentMethodParams {
  customerId: string;
  paymentMethodId: string;
}

export async function getCustomerPaymentMethod(
  params: CustomerPaymentMethodParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeCustomerPaymentMethod> {
  try {
    const stripe = createStripeInstance(stripeConfig);
    const paymentMethod: Stripe.PaymentMethod = await stripe.customers.retrievePaymentMethod(
      params.customerId,
      params.paymentMethodId
    );
    console.log('🔌 [getCustomerPaymentMethod]: Payment method retrieved', paymentMethod);
    
    return { data: paymentMethod, error: null };
  } catch (error) {
    console.error('[❌ getCustomerPaymentMethod error]: ', error);
    return { data: null, error: error as Error };
  }
}
