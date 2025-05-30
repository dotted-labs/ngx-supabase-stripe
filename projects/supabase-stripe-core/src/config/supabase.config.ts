/**
 * Supabase configuration interface
 */
export interface SupabaseConfig {
  /**
   * Supabase project URL
   */
  supabaseUrl: string;

  /**
   * Supabase API key
   */
  supabaseKey: string;
}

/**
 * Default Supabase configuration
 */
let supabaseConfig: SupabaseConfig | null = null;

/**
 * Configure Supabase settings
 * @param config The Supabase configuration
 */
export function configureSupabase(config: SupabaseConfig): void {
  supabaseConfig = config;
}

/**
 * Get the current Supabase configuration
 * @returns The Supabase configuration
 */
export function getSupabaseConfig(): SupabaseConfig {
  if (!supabaseConfig) {
    throw new Error('Supabase configuration not found. Please call configureSupabase() first.');
  }
  return supabaseConfig;
} 