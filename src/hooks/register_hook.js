import React, { useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const useRegister = ({ sdkOptions }) => {
  const [callState, setCallState] = useState('');
  const [pitelSDK, setPitelSDK] = useState();
  const [receivedPhoneNumber, setReceivedPhoneNumber] = useState('');

  const registerFunc = () => {
    const pitelSDKRes = pitelRegister({
      sdkOptions: sdkOptions,
      setCallState: setCallState,
      setReceivedPhoneNumber: setReceivedPhoneNumber,
    });
    setPitelSDK(pitelSDKRes);
  };

  return {
    // State
    callState,
    pitelSDK,
    receivedPhoneNumber,

    // setState
    setCallState,
    setPitelSDK,

    registerFunc,
  };
};
