import { SupabaseClient } from '@supabase/supabase-js';
import cookie from 'cookie';

import { SystemENV } from '@/env.system';

const supabaseGlobal = global as typeof global & {
  supabase?: SupabaseInstance;
};

export class SupabaseInstance {
  private client: SupabaseClient;
  private constructor() {
    this.client = new SupabaseClient(
      SystemENV.NEXT_PUBLIC_SUPABASE_URL,
      SystemENV.SUPABASE_PRIVATE_KEY
    );
  }

  static getInstance(): SupabaseInstance {
    if (!supabaseGlobal.supabase) {
      supabaseGlobal.supabase = new SupabaseInstance();
    }
    return supabaseGlobal.supabase;
  }

  getUserByCookie = async (cookieStr?: string) => {
    const parsedCookie = cookie.parse(cookieStr ?? '');
    if (parsedCookie['supabase-auth-token']) {
      const auth = JSON.parse(parsedCookie['supabase-auth-token']);
      const token = auth[0];
      const { data } = await this.client.auth.getUser(token ?? '');
      return data.user;
    }
    return null;
  };
}
