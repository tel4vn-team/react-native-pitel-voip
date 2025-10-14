// Import WebRTC polyfill FIRST to ensure proper initialization
import './utils/webrtc-polyfill';
import './utils/webrtcSafePatch';

// Add global error handler for better debugging
const globalAny = global as any;
if (typeof globalAny.ErrorUtils !== 'undefined') {
  const originalGlobalHandler = globalAny.ErrorUtils.getGlobalHandler();
  globalAny.ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
    console.error('[Global Error Handler]', error, 'isFatal:', isFatal);
    if (originalGlobalHandler) {
      originalGlobalHandler(error, isFatal);
    }
  });
}

import { Counter } from './components/counter';
import { PitelCallOut } from './components/pitel_call_out';
import { PitelCallNotif } from './components/pitel_call_notif';
import { PitelSDK } from './components/pitel_sdk';
import { PitelCallKit } from './screens/call_screen';
import { pitelRegister } from './services/pitel_register';
import { useRegister } from './hooks/register_hook';
import {
  getFcmToken,
  NotificationListener,
  NotificationBackground,
} from './notification/push_notif';
import { registerDeviceToken, removeDeviceToken } from './api/login_device';
import { PitelSDKProvider, PitelSDKContext } from './context/pitel_sdk_context';
import AirPlayManager from './modules/AirPlayManager';
import LockScreenManager from './modules/LockScreenManager';
import { AirPlayButton } from './components/airplay_button';

export {
  Counter,
  PitelCallOut,
  PitelCallKit,
  PitelCallNotif,
  PitelSDK,
  pitelRegister,
  useRegister,

  // push notif
  getFcmToken,
  NotificationListener,
  NotificationBackground,

  // Register Device Token
  registerDeviceToken,
  removeDeviceToken,

  // Context
  PitelSDKProvider,
  PitelSDKContext,

  // AirPlay (iOS only)
  AirPlayManager,
  AirPlayButton,

  // Lock Screen (Android only)
  LockScreenManager,

  // Utils
};
