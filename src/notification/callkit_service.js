import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNCallKeep from 'react-native-callkeep';

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));
const getNewUuid = () => uuidv4();
const format = (uuid) => uuid.split('-')[0];

export const callKitDisplay = (number) => {
  const callUUID = getNewUuid();
  console.log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);
  RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
};
