import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

const AnimatedTabPanel: React.FC<Props> = ({ mode = 'wait', key, children, ...props }) => {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={key}
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4 }}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

type Props = MotionProps & {
  mode?: 'wait' | 'sync' | 'popLayout';
  key: string;
  children: ReactNode;
};

export default AnimatedTabPanel;
