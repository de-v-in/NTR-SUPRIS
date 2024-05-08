import './globals.scss';

import type React from 'react';

import { LayoutWrapper } from '@/components/LayoutWrapper';
import { PageWrapper } from '@/components/PageWrapper';
import TRPCWrapper from '@/components/TRPCWrapper';

import SupabaseProvider from './supabase-provider';

export const metadata = {
  title: 'NTR-SUPRIS Template',
  description: 'A nextjs template with supabase and trpc',
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative w-full h-screen overflow-hidden bg-white">
        <SupabaseProvider>
          <TRPCWrapper>
            <LayoutWrapper>
              <>
                <div className="absolute top-0 left-0 w-full h-full z-10">
                  <div className="flex w-full h-full flex-col overflow-hidden">
                    <PageWrapper>{children}</PageWrapper>
                  </div>
                </div>
              </>
            </LayoutWrapper>
          </TRPCWrapper>
        </SupabaseProvider>
      </body>
    </html>
  );
}

export default RootLayout;
