import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';

import { callKitDisplay } from './callkit_service';
import { Linking } from 'react-native';

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

function handleNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  switch (remoteMessage?.data?.callType) {
    case 'CALL':
      if (remoteMessage.data != null) {
        const phoneNumber = remoteMessage.data.nameCaller ?? '';
        // const uuid = remoteMessage.data.uuid ?? '';
        callKitDisplay(phoneNumber);
      }
      break;
    case 'CANCEL_ALL':
    case 'CANCEL_GROUP':
      // if (remoteMessage.data.uuid) {
      //   RNCallKeep.endCall(remoteMessage.data.uuid);
      // }
      RNCallKeep.endAllCalls();
      break;
  }
}

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
      // handleNotification(remoteMessage);
    }
  );

  messaging()
    .getInitialNotification()
    .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification
        );
      }
    });
  messaging().onMessage(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('notification on foreground...', remoteMessage);
      handleNotification(remoteMessage);
    }
  );
};

export const NotificationBackground = () => {
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      // Linking.openURL('mychat://');
      // RNCallKeep.backToForeground();
      handleNotification(remoteMessage);
    }
  );
};
