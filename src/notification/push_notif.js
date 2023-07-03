import messaging from '@react-native-firebase/messaging';

import { callKitDisplay } from './callkit_service';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return true;
  } else {
    return false;
  }
}

export async function getFcmToken() {
  try {
    if (await requestUserPermission()) {
      const fcmToken = await messaging().getToken();
      return fcmToken;
    }
    return 'Empty';
  } catch (error) {
    return `Error: FCM token not found ${error}`;
  }
}

function handleNotification(remoteMessage) {
  switch (remoteMessage.data.callType) {
    case 'CALL':
      callKitDisplay(remoteMessage.data.phoneNumber);
      break;
    case 'CANCEL_ALL':
      break;
    case 'CANCEL_GROUP':
      break;
  }
}

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );
    // handleNotification(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification
        );
      }
    });
  messaging().onMessage(async (remoteMessage) => {
    console.log('notification on foreground...', remoteMessage);
    handleNotification(remoteMessage);
  });
};

export const NotificationBackground = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    handleNotification(remoteMessage);
  });
};
