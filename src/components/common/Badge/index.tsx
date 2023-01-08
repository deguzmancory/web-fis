import React, { HTMLProps } from 'react';
import { FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { Text } from '..';

import cn from 'classnames';

import { getClassNameByStatus } from 'src/utils';
import './styles.scss';

export type BadgeStatus = 'Pending' | 'Completed' | 'Approved' | 'Active' | 'Rejected';

const renderIcon = (variant: BadgeStatus) => {
  switch (variant) {
    case 'Pending':
      return <FaRegClock size={16} />;
    case 'Rejected':
      return <IoMdCloseCircleOutline size={20} />;
    default:
      return <FaCheckCircle size={16} />;
  }
};
const AccountBadge: React.FC<Props> = ({ variant, className, ...props }) => {
  return (
    <span
      {...props}
      className={cn(`cmp-deposition-badge`, getClassNameByStatus(variant), className)}
    >
      {renderIcon(variant)}
      <Text className="cmp-deposition-badge__text">{variant}</Text>
    </span>
  );
};

type Props = HTMLProps<HTMLSpanElement> & {
  variant: BadgeStatus;
};

export default AccountBadge;
