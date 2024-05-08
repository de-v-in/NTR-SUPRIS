'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const PageWrapper: TComponent = ({ children }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full z-0"
    >
      {children}
    </motion.div>
  );
};
