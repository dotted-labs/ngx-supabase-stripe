import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgxSupabaseStripeConfig } from '@ngx-supabase-stripe';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideNgxSupabaseStripeConfig(
      {
        supabaseConfig: {
          supabaseUrl: environment.supabase.url,
          supabaseKey: environment.supabase.key,
          supabaseSchema: 'public'
        },
        stripeConfig: {
          publishableKey: environment.stripe.publicKey,
        }
      }
    )
  ]
};
