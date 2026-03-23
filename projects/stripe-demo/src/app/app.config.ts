import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  AuthProvider,
  provideSupabaseAuth,
} from '@dotted-labs/ngx-supabase-auth';
import { provideNgxSupabaseStripeConfig, SUPABASE_BROWSER_CLIENT } from '@ngx-supabase-stripe';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { supabaseBrowserClient } from './supabase-browser-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: SUPABASE_BROWSER_CLIENT, useValue: supabaseBrowserClient },
    ...provideSupabaseAuth({
      supabaseClient: supabaseBrowserClient,
      redirectAfterLogin: '/',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
      socialLoginCallbackPath: '/auth/callback',
    }),
    ...provideNgxSupabaseStripeConfig({
      supabaseConfig: {
        supabaseUrl: environment.supabase.url,
        supabaseKey: environment.supabase.key,
        supabaseSchema: 'public',
      },
      stripeConfig: {
        publishableKey: environment.stripe.publicKey,
      },
    }),
  ],
};
