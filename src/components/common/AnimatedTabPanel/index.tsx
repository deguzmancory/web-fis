import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';

const AnimatedTabPanel: React.FC<Props> = ({
  mode = 'wait',
  uniqKey,
  transitionTime = 0.3,
  children,
  direction = 'horizontal',
  ...props
}) => {
  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={uniqKey}
        initial={{ x: direction === 'horizontal' ? 10 : 0, y: 0, opacity: 0 }}
        animate={{ x: 0, y: direction === 'vertical' ? 10 : 0, opacity: 1 }}
        exit={{
          x: direction === 'horizontal' && -10,
          y: direction === 'vertical' && -10,
          opacity: 0,
        }}
        transition={{ duration: transitionTime }}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

type Props = MotionProps & {
  mode?: 'wait' | 'sync' | 'popLayout';
  direction?: 'vertical' | 'horizontal' | 'none';
  uniqKey: string; //use "uniqKey" instead of "key" to avoid React Special Props waring (https://reactjs.org/link/special-props)
  children: ReactNode;
  transitionTime?: number;
};

export default AnimatedTabPanel;
