import { createContext, useState } from 'react';

export const PitelSDKContext = createContext({});

export const PitelSDKProvider = ({ children }) => {
  const [pitelSDK, setPitelSDK] = useState();

  return (
    <PitelSDKContext.Provider value={{ pitelSDK, setPitelSDK }}>
      {children}
    </PitelSDKContext.Provider>
  );
};
