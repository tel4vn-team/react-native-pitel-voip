import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import styles from './styles';
import { IconTextButton } from '../../components/icon_text_button';
import { IconButton } from '../../components/icon_button';

import MicroOn from '../../assets/svgs/mic_on.svg';
import MicroOff from '../../assets/svgs/mic_off.svg';
import SpeakerHigh from '../../assets/svgs/speaker_high.svg';
import SpeakerLow from '../../assets/svgs/speaker_low.svg';
import Hangup from '../../assets/svgs/hangup.svg';
import Call from '../../assets/svgs/call.svg';
import { Clock } from '../../components/clock/clock';

export const PitelCallKit = ({
  callID,
  pitelSDK,
  microState,
  speakerState,

  onHangup,
  onMicro,
  onSpeaker,

  phoneNumber,
  direction,
  callState,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerCallInfo}>
        <Text style={styles.txtDirection}>{direction}...</Text>
        <View style={styles.callInfoContainer}>
          <Text style={styles.txtPhoneNumber}>{phoneNumber}</Text>
          <Clock />
        </View>
      </View>
      <View style={styles.groupBtnAction}>
        <View style={styles.advancedBtnGroup}>
          <IconTextButton
            icon={microState ? <MicroOff /> : <MicroOn />}
            title={'Mute'}
            onPress={() => {
              onMicro();
              if (microState) {
                pitelSDK.unmute();
              } else {
                pitelSDK.mute();
              }
            }}
          />
          <IconTextButton
            icon={speakerState ? <SpeakerHigh /> : <SpeakerLow />}
            title={'Speaker'}
            onPress={async () => {
              onSpeaker();
              if (speakerState) {
                if (direction === 'Outgoing') {
                  InCallManager.setSpeakerphoneOn(false);
                } else {
                  await RNCallKeep.setAudioRoute(callID, 'Phone');
                }
              } else {
                if (direction === 'Outgoing') {
                  InCallManager.setSpeakerphoneOn(true);
                } else {
                  await RNCallKeep.setAudioRoute(callID, 'Speaker');
                }
              }
            }}
          />
        </View>
        <IconButton
          icon={<Hangup />}
          onPress={() => {
            InCallManager.stop();
            onHangup();
          }}
        />
      </View>
    </View>
  );
};
