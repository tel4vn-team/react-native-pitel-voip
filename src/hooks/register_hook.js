import React, { useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const useRegister = (sdkOptions) => {
  const [callState, setCallState] = useState('');
  const [pitelSDK, setPitelSDK] = useState();

  useEffect(() => {
    const pitelSDKRes = pitelRegister(sdkOptions, setCallState);
    setPitelSDK(pitelSDKRes);
  }, []);

  return {
    // State
    callState,
    pitelSDK,

    // setState
    setCallState,
    setPitelSDK,
  };
};
