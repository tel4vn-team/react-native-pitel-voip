import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import styles from './styles';
import { IconTextButton } from '../../components/icon_text_button';
import { IconButton } from '../../components/icon_button';

import MicroOn from '../../assets/svgs/mic_on.svg';
import MicroOff from '../../assets/svgs/mic_off.svg';
import SpeakerHigh from '../../assets/svgs/speaker_high.svg';
import SpeakerLow from '../../assets/svgs/speaker_low.svg';
import Hangup from '../../assets/svgs/hangup.svg';
import Call from '../../assets/svgs/call.svg';

export const PitelCallKit = ({
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
  const [acceptCall, setAcceptCall] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerCallInfo}>
        <Text style={styles.txtDirection}>{direction}...</Text>
        <View style={styles.callInfoContainer}>
          <Text style={styles.txtPhoneNumber}>{phoneNumber}</Text>
          <Text style={styles.txtTimer}>00:10</Text>
        </View>
      </View>
      {callState === 'CALL_RECEIVED' && !acceptCall ? (
        <View style={styles.incomingCall}>
          <IconButton
            icon={<Hangup />}
            onPress={() => {
              InCallManager.stop();
              onHangup();
              setAcceptCall(false);
            }}
          />
          <IconButton
            icon={<Call />}
            style={styles.acceptCall}
            onPress={() => {
              pitelSDK.accept();
              setAcceptCall(true);
            }}
          />
        </View>
      ) : (
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
              onPress={() => {
                onSpeaker();
                if (speakerState) {
                  InCallManager.setSpeakerphoneOn(false);
                } else {
                  InCallManager.setSpeakerphoneOn(true);
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
      )}
    </View>
  );
};
