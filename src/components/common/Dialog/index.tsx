import {
  CircularProgress,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  IconButton,
  Grow,
} from '@mui/material';
import React from 'react';
import { isEmpty } from 'src/validations';
import { Text, View } from '..';
import { REASON_CLOSE_DIALOG } from './helpers';
import './styles.scss';
import cn from 'classnames';
import { Callback } from 'src/redux/types';
import { IoClose } from 'react-icons/io5';
import { COLOR_CODE } from 'src/appConfig/constants';

const Dialog: React.FC<
  Omit<DialogProps, 'onClose'> & {
    iconTitle?: React.ReactNode;
    title: string;
    dialogActions?: React.ReactNode;
    dialogContentClasses?: DialogContentProps['classes'];
    fullScreen?: boolean;
    loading?: boolean;
    overflowVisible?: boolean;
    disabledButton?: boolean;
    hideTitle?: boolean;
    showTitleDivider?: boolean;
    hideFooter?: boolean;
    onClose?: Callback;
  }
> = ({
  iconTitle,
  children,
  title,
  dialogActions,
  dialogContentClasses,
  fullScreen,
  loading,
  overflowVisible,
  disabledButton,
  hideTitle,
  open,
  showTitleDivider = false,
  hideFooter = false,
  onClose,
  ...dialogProps
}) => {
  return (
    <MuiDialog
      open={open}
      // onClose={onClose}
      {...dialogProps}
      fullScreen={fullScreen}
      // disableBackdropClick={loading || disabledButton}
      classes={{
        paper: cn('cmp-dialog', {
          'cmp-dialog__content--visible': overflowVisible,
        }),
        container: 'cmp-dialog__container',
      }}
      TransitionComponent={Grow}
      BackdropProps={{
        transitionDuration: 0.4,
      }}
      {...dialogProps}
    >
      {!disabledButton && (
        <IconButton
          className="cmp-dialog__close-icon"
          onClick={(e) => {
            // e.stopPropagation();
            // e.preventDefault();
            onClose({}, REASON_CLOSE_DIALOG.CLOSE_ICON_CLICK);
          }}
        >
          <IoClose color={COLOR_CODE.PRIMARY_200} />
        </IconButton>
      )}
      {!hideTitle && (
        <DialogTitle
          className={cn('cmp-dialog__title', showTitleDivider && 'cmp-dialog__title-divider')}
        >
          <View isRow align="center" justify="space-between">
            <View isRow align="center">
              {iconTitle && <i className="mr-8">{iconTitle}</i>}
              <Text size={18} className="fw-bold mr-8">
                {isEmpty(title) ? ` ` : title}
              </Text>
              {loading && <CircularProgress size={25} />}
            </View>
          </View>
        </DialogTitle>
      )}
      <DialogContent
        classes={{
          root: cn('cmp-dialog__content', {
            'cmp-dialog__content--visible': overflowVisible,
          }),
        }}
      >
        {children}
      </DialogContent>
      {!isEmpty(dialogActions) && !hideFooter && (
        <DialogActions
          classes={{
            root: 'cmp-dialog__footer',
          }}
        >
          {dialogActions}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
