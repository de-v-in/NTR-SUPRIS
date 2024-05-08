'use client';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { cx } from '@/utilities/bootstraps';

const contextClass = {
  success: 'border-blue-500',
  error: 'border-red-500',
  info: 'border-gray-500',
  warning: 'border-orange-400',
  default: 'border-indigo-600',
  dark: 'border-white-600 font-gray-300',
};

export const LayoutWrapper: TComponent = ({ children }) => {
  useEffect(() => injectStyle(), []);

  return (
    <>
      <ToastContainer
        toastClassName={({ type }: TAny) =>
          cx(
            contextClass[type as keyof typeof contextClass],
            'bg-black bg-opacity-50 border relative flex p-1 min-h-10 rounded-none justify-between overflow-hidden cursor-pointer top-[80px] m-1'
          )
        }
        bodyClassName={() => 'text-sm font-white font-med block p-3 flex'}
        position="top-right"
        autoClose={3400}
      />
      {children}
    </>
  );
};
