import cn from 'classnames';
import React, { HTMLProps } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { RiErrorWarningFill } from 'react-icons/ri';
import { Text, View } from '..';
import './styles.scss';

const VARIANT = {
  completed: 'completed',
  pending: 'warning',
  rejected: 'rejected',
};

const renderIcon = (variant: Status) => {
  switch (variant) {
    case VARIANT.pending:
      return <RiErrorWarningFill size={16} />;
    case VARIANT.rejected:
      return <IoMdCloseCircleOutline size={16} />;
    default:
      return <FaCheckCircle size={16} />;
  }
};

const Banner: React.FC<Props> = ({ title, className, status, message, ...props }) => {
  return (
    <View className={cn('cmp-banner-item', className, `cmp-banner-item--${status}`)} {...props}>
      <View isRow className={cn('cmp-banner-item__header')}>
        {renderIcon(status)}
        <Text size={14} className="ml-8">{`${title}`}</Text>
      </View>

      <View className="ml-24">
        <Text className="cmp-banner-item__text">{message}</Text>
      </View>
    </View>
  );
};

type Status = 'completed' | 'warning' | 'rejected';

type Props = HTMLProps<HTMLDivElement> & {
  title: string;
  status: Status;
  message: string;
};

export default Banner;
