import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { Callback } from 'src/redux/types';
import urljoin from 'url-join';

const RouteLeavingGuard: React.FC<Props> = ({
  when,
  message,
  title,
  cancelTitle = 'Confirm Cancel',
  cancelMessage = 'Cancel editing?',
  cancelOkText = 'Yes, confirm',
  cancelText = 'No, keep it',
  onShowDialog,
  onHideDialog,
  confirmExitTabName,
  shouldBlockNavigation,
  navigate,
  onConfirmNavigationClick,
}) => {
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(urljoin(lastLocation.pathname, lastLocation.search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation, lastLocation]);

  const showDialog = (location = { search: '' }) => {
    const isAskConfirmCancel = location.search.includes(confirmExitTabName);
    onShowDialog({
      type: DIALOG_TYPES.YESNO_DIALOG,
      data: {
        cancelText: isAskConfirmCancel ? cancelText : 'No, stay',
        onCancel: onHideDialog,
        onOk: handleConfirmNavigationClick,
        okText: isAskConfirmCancel ? cancelOkText : 'Yes, leave',
        content: isAskConfirmCancel ? cancelMessage : message,
        // iconVariant: 'warning',
        title: isAskConfirmCancel ? cancelTitle : title,
        maxWidth: 'xs',
      },
    });
  };

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      showDialog(nextLocation);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setConfirmedNavigation(true);
    setTimeout(() => {
      if (onConfirmNavigationClick) {
        onConfirmNavigationClick();
      }
      onHideDialog();
    });
  };
  return <Prompt when={true} message={handleBlockedNavigation} />;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    when?: boolean;
    message?: string;
    title?: string;
    cancelTitle?: string;
    cancelMessage?: string;
    cancelOkText?: string;
    cancelText?: string;
    confirmExitTabName?: any;
    shouldBlockNavigation?: (location: string) => boolean;
    navigate?: Callback;
    onConfirmNavigationClick?: Callback;
  };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteLeavingGuard);
