import { createContext, useState, useEffect } from 'react';
import { pitelRegister } from '../services/pitel_register';

export const PitelSDKContext = createContext({});

export const PitelSDKProvider = ({ children }) => {
  const [pitelSDK, setPitelSDK] = useState();
  const [callID, setCallID] = useState('');
  const [startClock, setStartClock] = useState(false);

  //! Custom hook
  const [callState, setCallState] = useState('');
  const [receivedPhoneNumber, setReceivedPhoneNumber] = useState('');
  const [registerState, setRegisterState] = useState('UNREGISTER');

  useEffect(() => {
    if (callState === 'REGISTERED') {
      setRegisterState('REGISTERED');
    }
    if (callState === 'REGISTER') {
      setRegisterState('REGISTER');
    }
    if (callState === 'UNREGISTER') {
      setRegisterState('UNREGISTER');
    }
  }, [callState]);

  const registerFunc = async ({ sdkOptions, extension }) => {
    const pitelSDKRes = pitelRegister({
      sdkOptions: sdkOptions,
      setCallState: setCallState,
      setReceivedPhoneNumber: setReceivedPhoneNumber,
      extension: extension,
    });
    setPitelSDK(pitelSDKRes);
  };

  return (
    <PitelSDKContext.Provider
      value={{
        pitelSDK,
        setPitelSDK,
        callID,
        setCallID,
        startClock,
        setStartClock,

        // State
        callState,
        receivedPhoneNumber,
        registerState,

        // setState
        setCallState,
        setPitelSDK,
        registerFunc,
      }}
    >
      {children}
    </PitelSDKContext.Provider>
  );
};
