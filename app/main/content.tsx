'use client';

import { useState } from 'react';

import { trpc } from '@/utilities/trpc';

export const MainContent: TComponent = () => {
  const [count, setCount] = useState(0);
  trpc.public.ping.useSubscription(undefined, {
    onData: (data) => {
      setCount(data);
    },
  });
  return <h1 className="text-6xl font-bold">Hello World {count}</h1>;
};
