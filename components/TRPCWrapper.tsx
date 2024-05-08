'use client';

import { trpc } from '@/utilities/trpc';

const TRPCWrapper: TComponent = ({ children }) => {
  return <>{children}</>;
};

export default trpc.withTRPC(TRPCWrapper) as TComponent;
