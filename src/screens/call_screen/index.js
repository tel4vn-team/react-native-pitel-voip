import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
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
  onHangup,

  phoneNumber,
  direction,
  callState,
}) => {
  const [mute, setMute] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const selectAudio = async () => {
    if (direction === 'Outgoing') {
      selectAudioOutgoing(speaker);
    } else {
      selectAudioIncoming(speaker);
    }
  };

  const selectAudioIncoming = async () => {
    const res = await RNCallKeep.getAudioRoutes();
    if (speaker) {
      const typeSpeaker = res.find((item) => item.type == 'Phone').name;
      if (Platform.OS === 'android') {
        InCallManager.setSpeakerphoneOn(false);
      }
      await RNCallKeep.setAudioRoute(callID, typeSpeaker);
    } else {
      const typeSpeaker = res.find((item) => item.type == 'Speaker').name;
      if (Platform.OS === 'android') {
        InCallManager.setSpeakerphoneOn(true);
      }
      await RNCallKeep.setAudioRoute(callID, typeSpeaker);
    }
  };

  const selectAudioOutgoing = async () => {
    if (speaker) {
      if (Platform.OS == 'android') {
        // TODO: feature select audio
        // InCallManager.setSpeakerphoneOn(false);
        const res = await InCallManager.chooseAudioRoute('BLUETOOTH');
      } else {
        InCallManager.setSpeakerphoneOn(false);
      }
    } else {
      if (Platform.OS == 'android') {
        // TODO: feature select audio
        // InCallManager.setSpeakerphoneOn(false);
        const res = await InCallManager.chooseAudioRoute('SPEAKER_PHONE');
      } else {
        InCallManager.setSpeakerphoneOn(false);
      }
    }
  };

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
            icon={mute ? <MicroOff /> : <MicroOn />}
            title={'Mute'}
            onPress={() => {
              setMute(!mute);
              if (microState) {
                pitelSDK.unmute();
              } else {
                pitelSDK.mute();
              }
            }}
          />
          <IconTextButton
            icon={speaker ? <SpeakerHigh /> : <SpeakerLow />}
            title={'Speaker'}
            onPress={async () => {
              setSpeaker(!speaker);
              selectAudio();
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
