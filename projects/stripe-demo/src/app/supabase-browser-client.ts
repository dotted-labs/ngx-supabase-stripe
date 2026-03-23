import { createClient } from '@supabase/supabase-js';
import type { Database } from '@ngx-supabase-stripe';
import { environment } from '../environments/environment';

/**
 * Single Supabase client for ngx-supabase-auth and ngx-supabase-stripe (SUPABASE_BROWSER_CLIENT).
 */
export const supabaseBrowserClient = createClient<Database>(
  environment.supabase.url,
  environment.supabase.key,
);
