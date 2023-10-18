import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useAuthStore = create(
  combine({ user: null as User | null, session: null as Session | null }, (set) => ({
    setUser: (user: User | null) => set({ user }),
    setSession: (session: Session | null) => set({ session }),
  }))
);

export default useAuthStore;
