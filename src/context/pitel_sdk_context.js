import { createContext, useState } from 'react';

export const PitelSDKContext = createContext({});

export const PitelSDKProvider = ({ children }) => {
  const [pitelSDK, setPitelSDK] = useState();
  const [callID, setCallID] = useState('');

  return (
    <PitelSDKContext.Provider
      value={{ pitelSDK, setPitelSDK, callID, setCallID }}
    >
      {children}
    </PitelSDKContext.Provider>
  );
};
