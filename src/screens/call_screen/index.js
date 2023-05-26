import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles';
import { IconTextButton } from '../../components/icon_text_button';
import { IconButton } from '../../components/icon_button';

import MicroOn from '../../assets/svgs/mic_on.svg';
import MicroOff from '../../assets/svgs/mic_off.svg';
import SpeakerHigh from '../../assets/svgs/speaker_high.svg';
import Hangup from '../../assets/svgs/hangup.svg';

export const PitelCallKit = ({
  pitelSDK,
  microStatus,
  onHangup,
  onMicro,
  onSpeaker,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerCallInfo}>
        <Text style={styles.txtDirection}>Outgoing...</Text>
        <View style={styles.callInfoContainer}>
          <Text style={styles.txtPhoneNumber}>104</Text>
          <Text style={styles.txtTimer}>00:10</Text>
        </View>
      </View>
      <View style={styles.groupBtnAction}>
        <View style={styles.advancedBtnGroup}>
          <IconTextButton
            icon={microStatus ? <MicroOff /> : <MicroOn />}
            title={'Mute'}
            onPress={() => {
              onMicro();
              if (microStatus) {
                pitelSDK.unmute();
              } else {
                pitelSDK.mute();
              }
            }}
          />
          <IconTextButton
            icon={<SpeakerHigh />}
            title={'Speaker'}
            onPress={onSpeaker}
          />
        </View>
        <IconButton icon={<Hangup />} onPress={onHangup} />
      </View>
    </View>
  );
};
