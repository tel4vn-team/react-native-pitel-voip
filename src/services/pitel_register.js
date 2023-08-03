import PitelSDK from 'pitel-sdk-for-rn';

export const pitelRegister = ({
  sdkOptions,
  setCallState,
  setReceivedPhoneNumber,
  extension,
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
  const partnerOptions = {
    userAgentString: 'Pitel Connect - v1.0.0',
  };

  let pitelSDK = new PitelSDK(
    'xxx',
    'xxx',
    extension,
    sdkDelegates,
    sdkOptions,
    partnerOptions
  );
  return pitelSDK;
};
