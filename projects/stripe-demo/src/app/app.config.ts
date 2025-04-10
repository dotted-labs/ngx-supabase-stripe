import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgxSupabaseStripeConfig } from '@ngx-supabase-stripe';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxSupabaseStripeConfig(
      {
        supabaseConfig: {
          supabaseUrl: environment.supabase.url,
          supabaseKey: environment.supabase.key
        },
        stripeConfig: {
          publishableKey: environment.stripe.publicKey,
        }
      }
    )
  ]
};
