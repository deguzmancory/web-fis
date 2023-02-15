import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

const AnimatedTabPanel: React.FC<Props> = ({ mode = 'wait', uniqKey, children, ...props }) => {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={uniqKey}
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
  uniqKey: string; //use "uniqKey" instead of "key" to avoid React Special Props waring (https://reactjs.org/link/special-props)
  children: ReactNode;
};

export default AnimatedTabPanel;
