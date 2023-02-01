import cn from 'classnames';
import React from 'react';

import { Tooltip, Typography } from '@mui/material';
import { IoInformationCircle } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';
import { ViewProps } from 'src/components/common/View';
import { isEmpty } from 'src/validations';
import View from '../View';
import './styles.scss';

const Element: React.FC<Props> = ({
  id,
  children,
  errorMessage,
  label,
  className,
  subLabel,
  required,
  infoTooltipMessage = '',
  infoTooltipPlacement = 'right',
  infoToolTipWithArrow = true,
  ...props
}) => {
  const hasError = !isEmpty(errorMessage);
  const hasLabel = !isEmpty(label);
  const hasSubLabel = !isEmpty(subLabel);

  return (
    <View className={cn(className, 'form-element')} {...props}>
      {hasLabel && (
        <Typography
          variant="body2"
          classes={{
            root: 'mb-1',
          }}
          sx={{
            height: 24,
          }}
        >
          {label} {required && <span className="has-text-danger fw-bold text-is-16">*</span>}
          {infoTooltipMessage && (
            <span>
              <Tooltip
                arrow={infoToolTipWithArrow}
                title={<span style={{ whiteSpace: 'pre-line' }}>{infoTooltipMessage}</span>}
                placement={infoTooltipPlacement}
              >
                <i className="cursor-pointer ml-1">
                  <IoInformationCircle
                    size={16}
                    color={COLOR_CODE.INFO}
                    style={{
                      transform: 'translateY(2px)',
                    }}
                  />
                </i>
              </Tooltip>
            </span>
          )}
        </Typography>
      )}

      {hasSubLabel && subLabel}
      {children}
      {hasError && (
        <Typography
          variant="subtitle1"
          color={'error'}
          classes={{
            root: 'mt-1',
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  );
};

type Props = ViewProps & {
  children: React.ReactNode;
  id?: string;
  label?: string | React.ReactNode;
  errorMessage?: string;
  className?: string;
  subLabel?: string | React.ReactNode;
  required?: boolean;
  infoTooltipMessage?: string;
  infoTooltipPlacement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  infoToolTipWithArrow?: boolean;
};

export default Element;
