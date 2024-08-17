/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useContext } from 'react';

import VoipPushNotification from 'react-native-voip-push-notification';
import RNCallKeep from 'react-native-callkeep';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { Platform, AppState } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  MediaStreamTrackEvent,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'pitel-react-native-webrtc';

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  check,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import { PitelSDKContext } from '../context/pitel_sdk_context';
import {
  setCallDisplay,
  getCallDisplay,
} from '../notification/callkit_service';

window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
window.RTCSessionDescription =
  window.RTCSessionDescription || RTCSessionDescription;
window.MediaStream = window.MediaStream || MediaStream;
window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
window.MediaStreamTrackEvent =
  window.MediaStreamTrackEvent || MediaStreamTrackEvent;
window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
window.navigator.getUserMedia =
  window.navigator.getUserMedia || mediaDevices.getUserMedia;

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
        if (Platform.OS == 'ios') {
          RNCallKeep.endAllCalls();
        } else {
          RNNotificationCall.declineCall();
        }
        onHangup();
        setCallState('REGISTER');
        if (Platform.OS === 'android') {
          hangupAndroid();
        }
        InCallManager.stop();
        break;
      case 'CALL_CREATED':
        if (isCallOut) {
          onCreated();
        }
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
    if (Platform.OS == 'ios') {
      initializeCallKeep();
    } else {
      initIncomingCallAndroid();
    }
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

  //! Register when appstate active
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState == 'active' && !acceptCall && isLogin == 'TRUE') {
          if (Platform.OS == 'ios') {
            checkIsCall();
          }
          if (Platform.OS == 'android') {
            const callDisplay = getCallDisplay();
            if (callDisplay) return;
            checkIsCall();
          }
        }
      }
    );
    return () => {
      appStateListener?.remove();
    };
  }, [isLogin, acceptCall, sdkOptions]);

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

  const requestAndroidPermission = async () => {
    const granted = await requestMultiple([
      PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
      PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ]);
    if (granted[PERMISSIONS.ANDROID.READ_PHONE_NUMBERS] !== RESULTS.GRANTED)
      console.warn('[Pitel Logs]: READ_PHONE_NUMBERS not granted permission');
    return;
    if (granted[PERMISSIONS.ANDROID.POST_NOTIFICATIONS] !== RESULTS.GRANTED)
      console.warn('[Pitel Logs]: POST_NOTIFICATIONS not granted permission');
    return;
  };
  const initIncomingCallAndroid = async () => {
    await requestAndroidPermission();
    RNNotificationCall.addEventListener('endCall', (data) => {
      const { callUUID } = data;
      if (onEndCallAction) {
        onEndCallAction(data);
      }
      setAcceptCall(false);
      setCancelCall(true);
      setCallDisplay(false);
    });
    RNNotificationCall.addEventListener('answer', (data) => {
      const { callUUID } = data;
      setAcceptCall(true);
      setCallDisplay(false);
      setCallID(callUUID);
      if (onAnswerCallAction) {
        onAnswerCallAction(data);
      }
    });
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
    setCallDisplay(false);
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
    setCallDisplay(false);
    setCallID(callUUID);
    if (onAnswerCallAction) {
      onAnswerCallAction(data);
    }
  };

  return <>{children}</>;
};
