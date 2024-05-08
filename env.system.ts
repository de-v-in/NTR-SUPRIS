import { z } from 'zod';

import { WebENVSchema } from './env.web';

const SystemENVSchema = z
  .object({
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
     * Supabase configuration
     */
    SUPABASE_PRIVATE_KEY: z.string().min(1),
  })
  .merge(WebENVSchema);

/**
 * Return system ENV with parsed values
 */
export const SystemENV = SystemENVSchema.parse(process.env);
