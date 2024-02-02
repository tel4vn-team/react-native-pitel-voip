/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  MediaStreamTrackEvent,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'pitel-react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';

import { pitelRegister } from '../services/pitel_register';
import { useRegister } from '../hooks/register_hook';

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

export const PitelCallOut = ({
  pitelSDK,
  style,
  child,
  callToNumber,
  isCallOut,
  setIsCallOut,
  registerFunc,
  registerState,
  onCreated,
}) => {
  useEffect(() => {
    if (registerState == 'REGISTER' && isCallOut) {
      pitelSDK.call(callToNumber);
      onCreated();
    }
  }, [registerState, isCallOut]);

  const callOutgoing = () => {
    registerFunc();
    setIsCallOut(true);
    InCallManager.start({ media: 'audio', ringback: '_DEFAULT_' });
  };

  return (
    <TouchableOpacity
      style={[styles.btnCall, { ...style }]}
      onPress={callOutgoing}
    >
      {child}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCall: {
    height: 40,
    width: 200,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
