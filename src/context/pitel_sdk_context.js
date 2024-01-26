import { createContext, useState } from 'react';

export const PitelSDKContext = createContext({});

export const PitelSDKProvider = ({ children }) => {
  const [pitelSDK, setPitelSDK] = useState();
  const [callID, setCallID] = useState('');
  const [startClock, setStartClock] = useState(false);

  return (
    <PitelSDKContext.Provider
      value={{
        pitelSDK,
        setPitelSDK,
        callID,
        setCallID,
        startClock,
        setStartClock,
      }}
    >
      {children}
    </PitelSDKContext.Provider>
  );
};
