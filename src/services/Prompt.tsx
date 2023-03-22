import React from 'react';
import { Beforeunload } from 'react-beforeunload';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import RouteLeavingGuard from 'src/components/RouteLeavingGuard';
import { Callback } from 'src/redux/types';

const Prompt: React.FC<Props> = ({
  history,
  children,
  message,
  title,
  cancelTitle,
  cancelMessage,
  cancelOkText,
  cancelText,
  confirmExitTabName,
  condition,
  onConfirmNavigationClick,
}) => {
  return (
    <Beforeunload onBeforeunload={() => "You'll lose your data!"}>
      <RouteLeavingGuard
        navigate={(path) => history.push(path)}
        shouldBlockNavigation={condition}
        message={message}
        title={title}
        cancelTitle={cancelTitle}
        cancelMessage={cancelMessage}
        cancelOkText={cancelOkText}
        cancelText={cancelText}
        confirmExitTabName={confirmExitTabName}
        onConfirmNavigationClick={onConfirmNavigationClick}
      />
      {children}
    </Beforeunload>
  );
};

type BaseProps = {};

type Props = RouteComponentProps<BaseProps> & {
  history?: any;
  children?: any;
  message?: string;
  title?: string;
  cancelTitle?: string;
  cancelMessage?: string;
  cancelOkText?: string;
  cancelText?: string;
  confirmExitTabName?: any;
  condition?: (location: any) => boolean;
  onConfirmNavigationClick?: Callback;
};

export default withRouter(Prompt);
