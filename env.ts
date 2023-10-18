import { z } from 'zod';

const SystemENVSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /**
   * Feature flags, comma separated
   */
  FEATURE_FLAGS: z.string().default(''),
  /**
   * Prisma database URL
   */
  DATABASE_URL: z.string().min(1),
  /**
   * Server configuration
   */
  APP_URL: z.string().default('http://localhost'),
  APP_PORT: z.string().default('3000'),
  WS_PORT: z.string().default('3001'),
  /**
   * Supabase configuration
   */
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_PRIVATE_KEY: z.string().min(1),
});

/**
 * Return system ENV with parsed values
 */
export const SystemENV = SystemENVSchema.parse(process.env);
