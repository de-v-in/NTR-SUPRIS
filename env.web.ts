import { z } from 'zod';

export const WebENVSchema = z.object({
  /**
   * Supabase configuration
   */
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  /**
   * Server configuration
   */
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost'),
  NEXT_PUBLIC_APP_PORT: z.string().default('3000'),
  NEXT_PUBLIC_WS_PORT: z.string().default('3001'),
});

/**
 * Return web ENV with parsed values
 */
export const WebENV = WebENVSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT,
  NEXT_PUBLIC_WS_PORT: process.env.NEXT_PUBLIC_WS_PORT,
});
