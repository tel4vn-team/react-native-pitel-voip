import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNCallKeep from 'react-native-callkeep';

const getNewUuid = () => uuidv4();
const format = (uuid: string) => uuid.split('-')[0];

export const callKitDisplay = (number: string, uuid: string) => {
  const callUUID = uuid.length != 0 ? uuid : getNewUuid();

  console.log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);
  RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
};
