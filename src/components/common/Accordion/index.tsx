import React, { ReactNode, ReactSVGElement, useEffect, useState } from 'react';
import cn from 'classnames';
import './styles.scss';
import { View, Icon, Text } from 'src/components/common';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const Accordion: React.FC<Props> = ({
  title,
  className,
  children,
  isExpanded = false,
  subTitle,
  onToggle,
  disabled,
  ...props
}) => {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);

  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  const handleToggle = () => {
    if (disabled) return;
    if (!!onToggle) {
      onToggle(!expanded);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <View
      className={cn(
        'cmp-accordion-item',
        {
          'cmp-accordion-item--collapsed': expanded === false,
          'cmp-accordion-item--expanded': expanded === true,
        },
        className
      )}
    >
      <motion.header initial={false} onClick={handleToggle}>
        <View
          isRow
          justify="space-between"
          align="center"
          className={cn(
            'cmp-accordion-item__header',
            { 'cmp-accordion-item__header--expanded': expanded === true },
            { 'cmp-accordion-item__header--collapsed': expanded === false },
            { 'cmp-accordion-item__header--disabled': disabled === true }
          )}
        >
          <View isRow align="center">
            <Icon className="mr-16">{expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</Icon>

            {typeof title === 'string' ? (
              <Text className="fw-bold" size={16}>
                {title}
              </Text>
            ) : (
              title
            )}
            {!disabled && (
              <Text size={14} className="ml-16">
                Click here to {expanded ? 'Collapse' : 'Expand'}
              </Text>
            )}
          </View>
          <View isRow justify="flex-end" align="center">
            {subTitle && <View className="mr-16">{subTitle}</View>}
          </View>
        </View>
      </motion.header>
      <AnimatePresence initial={false}>
        <motion.section
          key="content"
          initial={isExpanded ? 'open' : 'collapsed'}
          animate={expanded ? 'open' : 'collapsed'}
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          {...props}
        >
          <View className="cmp-accordion-item__body">{children}</View>
        </motion.section>
      </AnimatePresence>
    </View>
  );
};

type Props = MotionProps & {
  title: string | ReactNode;
  children: ReactNode;
  subTitle?: string | ReactNode;
  className?: string;
  isExpanded?: boolean;
  customIcon?: ReactSVGElement;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
};

export default Accordion;
