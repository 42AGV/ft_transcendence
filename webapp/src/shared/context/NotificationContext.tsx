import * as React from 'react';

import { SnackBar, SnackbarType, SnackbarPosition } from '../components';

const NOTIFICATION_SPAN_MS = 4000;

type Context = {
  notify: (message: string) => void;
  warn: (message: string) => void;
  hide: () => void;
};

type NotificationContextProps = {
  children: React.ReactNode;
};

type Notification = {
  message: string;
  type: SnackbarType;
  position: SnackbarPosition;
};

const NotificationContext = React.createContext<Context | undefined>(undefined);

export const NotificationContextProvider = ({
  children,
}: NotificationContextProps) => {
  const [notification, setNotification] = React.useState<Notification>();
  const [visible, setVisible] = React.useState<boolean>(false);

  const notify = (message: string) => {
    if (message.length) {
      setNotification({ message, type: 'info', position: 'top' });
      setVisible(true);
    }
  };

  const warn = (message: string) => {
    if (message.length) {
      setNotification({ message, type: 'warning', position: 'bottom' });
      setVisible(true);
    }
  };

  const hide = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      hide();
    }, NOTIFICATION_SPAN_MS);
    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <NotificationContext.Provider value={{ notify, warn, hide }}>
      {children}
      {notification && (
        <SnackBar
          visible={visible}
          text={notification.message}
          position={notification.position}
          type={notification.type}
          onClick={() => hide()}
        />
      )}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be within NotificationContextProvider',
    );
  }
  return context;
}
