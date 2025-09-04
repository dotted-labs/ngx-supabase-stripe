import Stripe from 'stripe';
import { StripeEnvironmentConfig, SupabaseStripeResponse } from '../../../../types';
import { createStripeInstance } from '../../../utils';

export type StripeCustomerPaymentMethods = SupabaseStripeResponse<Stripe.PaymentMethod[]>;

export interface CustomerPaymentMethodsParams {
  customerId: string;
  type?: Stripe.PaymentMethodListParams.Type;
  limit?: number;
}

export async function getCustomerPaymentMethods(
  params: CustomerPaymentMethodsParams,
  stripeConfig: StripeEnvironmentConfig
): Promise<StripeCustomerPaymentMethods> {
  try {
    const stripe = createStripeInstance(stripeConfig);
    const listParams: Stripe.PaymentMethodListParams = {
      customer: params.customerId,
      ...(params.type && { type: params.type }),
      ...(params.limit && { limit: params.limit }),
    };
    
    const response: Stripe.ApiList<Stripe.PaymentMethod> = await stripe.paymentMethods.list(listParams);
    console.log('🔌 [getCustomerPaymentMethods]: Payment methods retrieved', response);
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('[❌ getCustomerPaymentMethods error]: ', error);
    return { data: null, error: error as Error };
  }
}
