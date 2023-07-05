/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import VoipPushNotification from 'react-native-voip-push-notification';
import RNCallKeep from 'react-native-callkeep';
import { Platform } from 'react-native';

export const PitelCallNotif = ({
  callId,
  setCallId,

  callkitSetup,
  children,
  onIOSToken,

  onNativeCall,
  onAnswerCallAction,
  onEndCallAction,
  onIncomingCallDisplayed,
  onToggleMute,
  onDTMF,
}) => {
  useEffect(() => {
    initializeCallKeep();
    if (Platform.OS == 'ios') {
      pushkit();
    }
  }, []);

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
    onNativeCallPitel(data);
  };
  const onEndCallActionPitel = (data) => {
    onEndCallAction(data);
    let { callUUID } = data;
    // RNCallKeep.endCall(callUUID);
  };
  const onToggleMutePitel = (data) => {
    let { muted, callUUID } = data;
    onToggleMute(data);
  };
  const onDTMFPitel = (data) => {
    let { digits, callUUID } = data;
    onDTMF(data);
  };

  const onIncomingCallDisplayedPitel = (data) => {
    // Incoming call displayed (used for pushkit on iOS)
    onIncomingCallDisplayed(data);
  };

  const onAnswerCallActionPitel = (data) => {
    onAnswerCallAction(data);
    // called when the user answer the incoming call
    // answer(true);
    // setUUIDCall(callUUID);

    // RNCallKeep.setCurrentCallActive(callUUID);

    // // On Android display the app when answering a video call
    // if (!isIOS && currentSession.cameraEnabled) {
    //   RNCallKeep.backToForeground();
    // }
  };

  return <>{children}</>;
};
