import React, { useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const useRegister = ({ sdkOptions, extension, setPitelSDK }) => {
  const [callState, setCallState] = useState('');
  const [receivedPhoneNumber, setReceivedPhoneNumber] = useState('');
  const [receivedDisplayName, setReceivedDisplayName] = useState('');
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
    try {
      const pitelSDKRes = await pitelRegister({
        sdkOptions: sdkOptions,
        setCallState: setCallState,
        setReceivedPhoneNumber: setReceivedPhoneNumber,
        setReceivedDisplayName: setReceivedDisplayName,
        extension: extension,
      });
      setPitelSDK(pitelSDKRes);
    } catch (error) {
      console.error('[useRegister] Failed to register:', error);
      setCallState('ERROR');
    }
  };

  return {
    // State
    callState,
    receivedPhoneNumber,
    receivedDisplayName,
    registerState,

    // setState
    setCallState,
    setPitelSDK,
    registerFunc,
  };
};
