import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { y: 40, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -30, opacity: 0, scale: 0.96 },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
