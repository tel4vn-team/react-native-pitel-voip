import React, { useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const useRegister = ({ sdkOptions }) => {
  const [callState, setCallState] = useState('');
  const [pitelSDK, setPitelSDK] = useState();

  const registerFunc = () => {
    const pitelSDKRes = pitelRegister({
      sdkOptions: sdkOptions,
      setCallState: setCallState,
    });
    setPitelSDK(pitelSDKRes);
  };

  return {
    // State
    callState,
    pitelSDK,

    // setState
    setCallState,
    setPitelSDK,

    registerFunc,
  };
};
