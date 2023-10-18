'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

export const PageWrapper: TComponent = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => injectStyle(), []);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full z-0">
      {children}
    </motion.div>
  );
};
