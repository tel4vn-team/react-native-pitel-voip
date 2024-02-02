/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useContext } from 'react';

import VoipPushNotification from 'react-native-voip-push-notification';
import RNCallKeep from 'react-native-callkeep';
import { Platform, AppState } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PitelSDKContext } from '../context/pitel_sdk_context';

export const PitelCallNotif = ({
  callkitSetup,
  children,
  onIOSToken,

  // Callkit listener
  onNativeCall,
  onAnswerCallAction,
  onEndCallAction,
  onIncomingCallDisplayed,
  onToggleMute,
  onDTMF,

  //! Config
  registerFunc,
  isCallOut,
  setIsCallOut,
  setCallID,
  sdkOptions,
  isLogin,

  pitelSDK,
  setCallState,
  callState,
  onReceived,
  onHangup,
}) => {
  const [acceptCall, setAcceptCall] = useState(false);
  const [cancelCall, setCancelCall] = useState(false);

  const [enableHangup, setEnableHangup] = useState(true);

  const { startClock, setStartClock } = useContext(PitelSDKContext);

  useEffect(() => {
    console.log('======callState================', callState);
    switch (callState) {
      case 'CALL_RECEIVED':
        setIsCallOut(false);
        if (Platform.OS == 'ios') {
          if (acceptCall) {
            pitelSDK.accept();
            onReceived();
          }
        } else {
          acceptCallAndroid();
        }
        break;
      case 'CALL_HANGUP':
        setStartClock(false);
        setEnableHangup(false);
        setIsCallOut(false);
        onHangup();
        setCallState('REGISTER');
        if (Platform.OS === 'android') {
          hangupAndroid();
        }
        InCallManager.stop();
        break;
      case 'CALL_CREATED':
        break;
      case 'CALL_ANSWERED':
        setEnableHangup(true);
        setStartClock(true);
        InCallManager.stopRingback();
        break;
    }
  }, [pitelSDK, callState, isCallOut]);

  const acceptCallAndroid = async () => {
    const value = await AsyncStorage.getItem('ACCEPT_CALL');
    if (value === 'TRUE' || acceptCall) {
      pitelSDK.accept();
      onReceived();
    }
  };

  const hangupAndroid = async () => {
    await AsyncStorage.setItem('ACCEPT_CALL', 'FALSE');
  };

  // Init
  useEffect(() => {
    initializeCallKeep();
    if (Platform.OS == 'ios') {
      pushkit();
    }
  }, []);

  // Hanlde incoming call
  useEffect(() => {
    console.log('===========acceptCall===========', acceptCall);
    if (acceptCall) {
      registerFunc();
    }
  }, [acceptCall]);

  //! For IOS
  useEffect(() => {
    if (cancelCall) {
      if (enableHangup) {
        pitelSDK.hangup();
      }
      setCancelCall(false);
    }
  }, [cancelCall]);

  //! 1.0.6
  useEffect(() => {
    checkIsCall();
  }, [sdkOptions, isLogin]);

  const checkIsCall = async () => {
    if (isLogin == 'FALSE') return;
    if (Platform.OS == 'android') {
      if (sdkOptions) {
        if (sdkOptions.contactParams['pn-prid'] !== '') {
          registerFunc();
        }
      }
    }
    if (Platform.OS == 'ios') {
      const res = await RNCallKeep.getCalls();
      if (res.length == 0) {
        if (sdkOptions) {
          if (sdkOptions.contactParams['pn-prid'] !== '') {
            registerFunc();
          }
        }
        console.log(res);
      }
    }
  };

  //! 1.0.6 Register when appstate active
  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     (nextAppState) => {
  //       if (nextAppState == 'active' && !acceptCall && isLogin == 'TRUE') {
  //         checkIsCall();
  //       }
  //     }
  //   );
  //   return () => {
  //     appStateListener?.remove();
  //   };
  // }, [isLogin, acceptCall, sdkOptions]);

  const pushkit = () => {
    VoipPushNotification.addEventListener('register', (token) => {
      onIOSToken(token);
    });

    VoipPushNotification.addEventListener('notification', (notification) => {
      VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
    });

    VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
      if (!events || !Array.isArray(events) || events.length < 1) {
        return;
      }
      for (let voipPushEvent of events) {
        let { name, data } = voipPushEvent;
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
        ) {
          // this.onVoipPushNotificationRegistered(data);
        } else if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          // this.onVoipPushNotificationiReceived(data);
        }
      }
    });
    VoipPushNotification.registerVoipToken();
  };

  const initializeCallKeep = async () => {
    try {
      await RNCallKeep.setup(callkitSetup);
    } catch (err) {
      console.error('initializeCallKeep error:', err);
    }

    // Add RNCallKit Events
    RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCallPitel);
    RNCallKeep.addEventListener('answerCall', onAnswerCallActionPitel);
    RNCallKeep.addEventListener('endCall', onEndCallActionPitel);
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      onIncomingCallDisplayedPitel
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      onToggleMutePitel
    );
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMFPitel);
  };

  const onNativeCallPitel = (data) => {
    let { handle, callUUID, name } = data;
    if (onNativeCall) {
      onNativeCallPitel(data);
    }
  };
  const onEndCallActionPitel = (data) => {
    if (onEndCallAction) {
      onEndCallAction(data);
    }
    let { callUUID } = data;
    setAcceptCall(false);
    setCancelCall(true);
    RNCallKeep.endCall(callUUID);
  };
  const onToggleMutePitel = (data) => {
    let { muted, callUUID } = data;
    if (onToggleMute) {
      onToggleMute(data);
    }
  };
  const onDTMFPitel = (data) => {
    let { digits, callUUID } = data;
    if (onDTMF) {
      onDTMF(data);
    }
  };

  const onIncomingCallDisplayedPitel = (data) => {
    // Incoming call displayed (used for pushkit on iOS)
    if (onIncomingCallDisplayed) {
      onIncomingCallDisplayed(data);
    }
  };

  const onAnswerCallActionPitel = async (data) => {
    let callUUID = data?.callUUID ?? '';
    RNCallKeep.setCurrentCallActive(callUUID);
    setAcceptCall(true);
    setCallID(callUUID);
    if (onAnswerCallAction) {
      onAnswerCallAction(data);
    }
  };

  return <>{children}</>;
};
