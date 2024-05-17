/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';

import { pitelRegister } from '../services/pitel_register';
import { useRegister } from '../hooks/register_hook';

export const PitelCallOut = ({
  pitelSDK,
  style,
  child,
  callToNumber,
  setIsCallOut,
  onPress,
  enable,
}) => {
  const callOutgoing = () => {
    if (enable) {
      onPress();
      setIsCallOut(true);
      InCallManager.start({ media: 'audio', ringback: '_DEFAULT_' });

      pitelSDK.call(callToNumber);
    }
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
