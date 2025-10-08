import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
// Only import RNCallKeep on iOS to avoid Android conflicts
let RNCallKeep: any;
if (Platform.OS === 'ios') {
  RNCallKeep = require('react-native-callkeep').default;
}
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

const getNewUuid = () => uuidv4();
const format = (uuid: string) => uuid.split('-')[0];

export const callKitDisplay = (number: string, uuid: string) => {
  const callUUID = uuid.length != 0 ? uuid : getNewUuid();

  console.log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);
  if (Platform.OS == 'ios' && RNCallKeep) {
    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  } else {
    RNNotificationCall.displayNotification(callUUID, null, 30000, {
      channelId: 'com.pitel.uikit',
      channelName: 'Incoming call',
      notificationIcon: 'ic_launcher',
      notificationTitle: number,
      notificationBody: 'Incoming call',
      answerText: 'Answer',
      declineText: 'Decline',
      notificationColor: 'colorAccent',
      isVideo: false,
      notificationSound: undefined,
    });
  }
};

let callDisplay = false;

export const setCallDisplay = (value: boolean) => {
  callDisplay = value;
};

export const getCallDisplay = () => callDisplay;
