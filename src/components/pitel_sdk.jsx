import React, { useEffect, useState } from 'react';
import { Platform, LogBox } from 'react-native';
import { getFcmToken, NotificationListener } from '../notification/push_notif';
import { registerDeviceToken, removeDeviceToken } from '../api/login_device';

export const PitelSDK = ({
  children,
  sdkOptionsInit,
  setSdkOptions,
  iosPushToken,
  setIOSPushToken,
}) => {
  // useState & useRegister
  const [deviceToken, setDeviceToken] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    NotificationListener();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      initSdkOption();
    }
    if (Platform.OS === 'ios' && iosPushToken.length !== 0) {
      initSdkOption();
    }
  }, [iosPushToken]);

  const initSdkOption = async () => {
    const fcmToken = await getFcmToken();
    const deviceToken = Platform.OS == 'android' ? fcmToken : iosPushToken;
    setFcmToken(fcmToken);
    setDeviceToken(deviceToken);
    const sdkOptionsInitialize = {
      sipOnly: true,
      sipDomain: `${sdkOptionsInit.sipDomain}:${sdkOptionsInit.port}`,
      wsServer: sdkOptionsInit.wssServer,
      sipPassword: sdkOptionsInit.sipPassword,
      // reconnectAttempts: 0,
      debug: true,
      contactName: sdkOptionsInit.extension,
      viaHost: sdkOptionsInit.sipDomain,
      contactParams: {
        'transport': 'ws',
        'pn-provider': Platform.OS == 'android' ? 'fcm' : 'apns',
        'pn-prid': deviceToken,
        'pn-param':
          Platform.OS == 'android'
            ? sdkOptionsInit.packageId
            : `${sdkOptionsInit.teamId}.${sdkOptionsInit.bundleId}.voip`,
        'fcm-token': fcmToken,
      },
    };
    setSdkOptions(sdkOptionsInitialize);
  };

  return <>{children}</>;
};
