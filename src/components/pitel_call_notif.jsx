/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import VoipPushNotification from 'react-native-voip-push-notification';
import RNCallKeep from 'react-native-callkeep';
import { Platform, AppState } from 'react-native';
import InCallManager from 'react-native-incall-manager';

export const PitelCallNotif = ({
  callkitSetup,
  children,
  onIOSToken,
  isLogin,

  // Callkit listener
  onNativeCall,
  onAnswerCallAction,
  onEndCallAction,
  onIncomingCallDisplayed,
  onToggleMute,
  onDTMF,

  //! Config
  sdkOptions,
  registerFunc,
  isCallOut,
  setIsCallOut,
  setCallID,

  pitelSDK,
  setCallState,
  callState,
  onReceived,
  onHangup,
  onCreated,
}) => {
  const [acceptCall, setAcceptCall] = useState(false);
  const [cancelCall, setCancelCall] = useState(false);

  const [enableHangup, setEnableHangup] = useState(true);

  useEffect(() => {
    console.log('======callState================', callState);

    switch (callState) {
      case 'CALL_RECEIVED':
        setIsCallOut(false);
        onReceived();
        break;
      case 'CALL_HANGUP':
        setEnableHangup(false);
        onHangup();
        setCallState('REGISTER');
        InCallManager.stop();
        break;
      case 'CALL_CREATED':
        if (isCallOut) {
          onCreated();
        }
        break;
      case 'CALL_ANSWERED':
        setEnableHangup(true);
        InCallManager.stopRingback();
        break;
    }
  }, [pitelSDK, callState, isCallOut]);

  // Init
  useEffect(() => {
    initializeCallKeep();
    if (Platform.OS == 'ios') {
      pushkit();
    }
  }, []);

  // Hanlde incoming call
  useEffect(() => {
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

  useEffect(() => {
    checkIsCall();
  }, [sdkOptions]);

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

  //! Register when appstate active

  const [aState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        console.log('Next AppState is: ', nextAppState);
        setAppState(nextAppState);
      }
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (aState == 'active') {
      registerFunc();
    }
  }, [aState]);

  const pushkit = () => {
    VoipPushNotification.addEventListener('register', (token) => {
      // --- send token to your apn provider server
      onIOSToken(token);
    });

    VoipPushNotification.addEventListener('notification', (notification) => {
      // --- when receive remote voip push, register your VoIP client, show local notification ... etc
      // this.doSomething();

      // --- optionally, if you `addCompletionHandler` from the native side, once you have done the js jobs to initiate a call, call `completion()`
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

  const onAnswerCallActionPitel = (data) => {
    let { callUUID } = data;
    RNCallKeep.setCurrentCallActive(callUUID);
    setAcceptCall(true);
    setCallID(callUUID);
    if (onAnswerCallAction) {
      onAnswerCallAction(data);
    }
  };

  return <>{children}</>;
};
