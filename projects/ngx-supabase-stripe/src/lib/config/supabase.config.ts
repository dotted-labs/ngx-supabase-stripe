import { InjectionToken, Provider } from '@angular/core';

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

export const SUPABASE_CONFIG = new InjectionToken<SupabaseConfig>('SUPABASE_CONFIG');

/**
 * Provides the Supabase configuration
 * @param config The Supabase configuration
 * @returns An array of providers
 */
export function provideSupabaseConfig(config: SupabaseConfig): Provider[] {
  return [
    {
      provide: SUPABASE_CONFIG,
      useValue: config
    }
  ];
}

