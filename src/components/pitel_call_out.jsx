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
import { pitelRegister } from '../services/pitel_register';
import { pitelCallOut } from '../services/pitel_call_out';

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
  sdkOptions,
  pitelSDK,
  setPitelSDK,
  handleCallOut,
  style,
  btnTitle,
  callToNumber,
  onHangup,
}) => {
  useEffect(() => {
    const pitelSDKRes = registerExtension();
    setPitelSDK(pitelSDKRes);
  }, []);

  const registerExtension = () => {
    pitelRegister(sdkOptions);
  };
  const callOutgoing = () => {
    handleCallOut();
    const pitelSDKRes = pitelCallOut({
      sdkOptions: sdkOptions,
      callToNumber: callToNumber,
      onHangup: onHangup,
    });
    setPitelSDK(pitelSDKRes);
  };

  return (
    <TouchableOpacity
      style={[styles.btnCall, { ...style }]}
      onPress={callOutgoing}
    >
      <Text>{btnTitle}</Text>
    </TouchableOpacity>
  );
};

{
  /* <Text>Pushkit, Callkit</Text>
      <TouchableOpacity style={styles.btnCall} onPress={registerExtension}>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={callOutgoing}>
        <Text>Call out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={hangup}>
        <Text>Hand up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={handleMute}>
        <Text>Mute</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={handleUnMute}>
        <Text>Unmute</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={speakerOn}>
        <Text>Speaker on</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCall} onPress={speakerOff}>
        <Text>Speaker off</Text>
      </TouchableOpacity> */
}
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
