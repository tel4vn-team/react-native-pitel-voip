import PitelSDK from 'pitel-sdk-webrtc';

export const pitelRegister = ({ sdkOptions, setCallState }) => {
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
