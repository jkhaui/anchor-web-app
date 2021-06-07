import { firebaseOptions, firebaseVapidKey } from 'env';
import firebase from 'firebase';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface NotificationProviderProps {
  children: ReactNode;
}

export interface NotificationState {
  permission: NotificationPermission;
  messagingToken: string | undefined;
  create: (
    title: string,
    options?: NotificationOptions,
  ) => Notification | undefined;
}

const NotificationContext: Context<NotificationState> =
  // @ts-ignore
  createContext<NotificationState>();

firebase.initializeApp(firebaseOptions);

async function getNotificationPermission(): Promise<NotificationPermission> {
  if (
    Notification.permission === 'granted' ||
    Notification.permission === 'denied'
  ) {
    return Notification.permission;
  }

  return Notification.requestPermission();
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  const [messagingToken, setMessagingToken] =
    useState<string | undefined>(undefined);

  const create = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission === 'granted') {
        return new Notification(title, options);
      } else if (permission === 'default') {
        getNotificationPermission().then((nextPermission) => {
          setPermission(nextPermission);
          if (nextPermission === 'granted') {
            return new Notification(title, options);
          }
        });
      }
    },
    [permission],
  );

  useEffect(() => {
    if (!('Notification' in window)) {
      return;
    }

    getNotificationPermission().then((initialPermission) => {
      console.log('notification.tsx..()', initialPermission);
      setPermission(initialPermission);
    });

    const messaging = firebase.messaging();

    messaging
      .getToken({
        vapidKey: firebaseVapidKey,
      })
      .then((token) => {
        setMessagingToken(token);

        messaging.onMessage({
          next: (value: firebase.messaging.MessagePayload) => {
            if (value.notification) {
              new Notification(value.notification.title ?? 'Anchor', {
                body: value.notification.body,
              });
            }
            console.log('notification.tsx..next()', value);
          },
          error: (error) => {
            console.error('notification.tsx..error()', error);
          },
          complete: () => {
            console.log('notification.tsx..complete()');
          },
        });
      });
  }, []);

  const state = useMemo<NotificationState>(
    () => ({
      permission,
      create,
      messagingToken,
    }),
    [create, messagingToken, permission],
  );

  return (
    <NotificationContext.Provider value={state}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationState {
  return useContext(NotificationContext);
}

export const NotificationConsumer: Consumer<NotificationState> =
  NotificationContext.Consumer;
