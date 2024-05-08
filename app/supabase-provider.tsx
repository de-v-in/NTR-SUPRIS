'use client';

import { createClientComponentClient, type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { isEqual } from 'lodash';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import useAuthStore from '@/states/authStore';

type SupabaseContext = {
  supabase: SupabaseClient<TAny>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClientComponentClient());
  const { session, user, setSession, setUser } = useAuthStore();
  const prev = useRef({ session, user });

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to run this effect only once
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, _session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else {
        if (!isEqual(_session, prev.current.session)) {
          setSession(_session);
          prev.current.session = _session;
        }
        if (!isEqual(_session?.user, prev.current.user)) {
          setUser(_session?.user ?? null);
          prev.current.user = _session?.user ?? null;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
