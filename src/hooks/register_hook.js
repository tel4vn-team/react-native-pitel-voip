import React, { useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const useRegister = ({ sdkOptions, extension, setPitelSDK }) => {
  const [callState, setCallState] = useState('');
  const [receivedPhoneNumber, setReceivedPhoneNumber] = useState('');
  const [registerState, setRegisterState] = useState('UNREGISTER');

  useEffect(() => {
    if (callState === 'REGISTER') {
      setRegisterState('REGISTER');
    }
    if (callState === 'UNREGISTER') {
      setRegisterState('UNREGISTER');
    }
  }, [callState]);

  const registerFunc = async () => {
    const pitelSDKRes = pitelRegister({
      sdkOptions: sdkOptions,
      setCallState: setCallState,
      setReceivedPhoneNumber: setReceivedPhoneNumber,
      extension: extension,
    });
    setPitelSDK(pitelSDKRes);
  };

  return {
    // State
    callState,
    receivedPhoneNumber,
    registerState,

    // setState
    setCallState,
    setPitelSDK,
    registerFunc,
  };
};
