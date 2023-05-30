import PitelSDK from 'pitel-sdk-webrtc';

export const pitelRegister = ({
  sdkOptions,
  setCallState,
  setReceivedPhoneNumber,
}) => {
  const sdkDelegates = {
    onRegistered() {
      setCallState('REGISTER');
    },
    onUnregistered() {
      setCallState('UNREGISTER');
    },
    onCallCreated(remoteNumber) {
      setCallState('CALL_CREATED');
    },
    onCallReceived(remoteNumber) {
      setReceivedPhoneNumber(remoteNumber);
      setCallState('CALL_RECEIVED');
    },
    onCallAnswered() {
      setCallState('CALL_ANSWERED');
    },
    onCallHangup() {
      setCallState('CALL_HANGUP');
    },
    onCallHold() {
      setCallState('CALL_HOLD');
    },
  };
  let pitelSDK = new PitelSDK('xxx', 'xxx', '103', sdkDelegates, sdkOptions);
  return pitelSDK;
};
