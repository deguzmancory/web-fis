import { IRootState } from 'src/redux/rootReducer';
import { connect } from 'react-redux';
import React from 'react';
import { Button, View } from 'src/components/common';
import './styles.scss';
import { Callback } from 'src/redux/types';
import cn from 'classnames';
import { Popover, SxProps } from '@mui/material';

const MuiPopOverFilter: React.FC<Props> = ({
  label,
  body,
  mini,
  isShow = true,
  labelClassName,
  anchorOrigin,
  transformOrigin,
  icon,
  disabledTransformOrigin = false,
  bodyStyle,
  popoverSx,
  onShow,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    onShow && onShow(true);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    onShow && onShow(false);
  };

  const open = Boolean(anchorEl) && isShow;
  const id = open ? 'simple-popover' : undefined;

  return (
    <React.Fragment>
      <Button
        onClick={handleClick}
        variant="link"
        className={cn('cmp-popover__button', labelClassName)}
        {...(icon && {
          icon: icon,
        })}
      >
        {label}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: anchorOrigin?.vertical || 'bottom',
          horizontal: anchorOrigin?.horizontal || 'left',
        }}
        {...(!disabledTransformOrigin && {
          transformOrigin: {
            vertical: transformOrigin?.vertical || 'top',
            horizontal: transformOrigin?.horizontal || 'right',
          },
        })}
        classes={{
          paper: 'px-0',
        }}
        className={cn('cmp-popover', { 'is-mini': mini })}
        style={{ borderRadius: '8px !important' }}
        sx={popoverSx}
      >
        <View
          className=""
          style={{ maxWidth: 380, ...bodyStyle }}
          onClick={(event) => {
            event.stopPropagation();
            !onShow && handleClose(event);
          }}
        >
          {body}
        </View>
      </Popover>
    </React.Fragment>
  );
};

type PositionVerticalType = number | 'bottom' | 'top' | 'center';
type PositionHorizontalType = number | 'center' | 'left' | 'right';

export type PopoverPosition = {
  vertical: PositionVerticalType;
  horizontal: PositionHorizontalType;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    label: string | React.ReactNode;
    labelClassName?: string;
    body: React.ReactNode;
    mini?: boolean;
    isShow?: boolean;
    anchorOrigin?: PopoverPosition;
    transformOrigin?: PopoverPosition;
    disabledTransformOrigin?: boolean;
    icon?: React.ReactElement;
    popoverSx?: SxProps;
    bodyStyle?: React.CSSProperties;
    onShow?: Callback;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MuiPopOverFilter);
