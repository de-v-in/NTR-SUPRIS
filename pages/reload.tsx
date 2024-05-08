import '@/app/globals.scss';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import SupabaseProvider, { useSupabase } from '@/app/supabase-provider';
import { trpc } from '@/utilities/trpc';

const CheckIn = () => {
  const router = useRouter();
  const supabase = useSupabase();
  const user = trpc.user.login.useMutation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this effect only once
  useEffect(() => {
    const data = supabase.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || !!session) {
        user.mutateAsync().then(() => {
          router.replace('/');
        });
        data.data.subscription.unsubscribe();
      }
    });
  }, [router]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>
        <span className="text-lg">Login successfully, redirecting...</span>
      </div>
    </div>
  );
};

function CheckInPage() {
  return (
    <SupabaseProvider>
      <CheckIn />
    </SupabaseProvider>
  );
}

export default trpc.withTRPC(CheckInPage);
