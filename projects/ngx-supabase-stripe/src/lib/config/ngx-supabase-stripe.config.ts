import { EnvironmentProviders, Provider } from '@angular/core';
import { STRIPE_CONFIG, StripeConfig } from './stripe.config';
import { SUPABASE_CONFIG, SupabaseConfig } from './supabase.config';

export interface NgxSupabaseStripeConfig {
  supabaseConfig: SupabaseConfig;
  stripeConfig: StripeConfig;
}

/**
 * Provides the NgxSupabaseStripeConfig object
 * @param config The NgxSupabaseStripeConfig object
 * @returns The NgxSupabaseStripeConfig object
 */
export function provideNgxSupabaseStripeConfig(
  config: NgxSupabaseStripeConfig
): (Provider | EnvironmentProviders)[] {
  const providers: (Provider | EnvironmentProviders)[] = [
    {
      provide: SUPABASE_CONFIG,
      useValue: config.supabaseConfig
    },
    {
      provide: STRIPE_CONFIG,
      useValue: config.stripeConfig
    }
  ];

  return providers;
}

