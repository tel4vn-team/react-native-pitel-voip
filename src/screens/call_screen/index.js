import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import styles from './styles';
import { IconTextButton } from '../../components/icon_text_button';
import { IconButton } from '../../components/icon_button';

import { Clock } from '../../components/clock/clock';
import { AudioModal } from '../../components/modals/audio_modal';

export const PitelCallKit = ({
  callID,
  pitelSDK,
  onHangup,

  textClock,
  phoneNumber,
  direction,
  callState,
}) => {
  const [mute, setMute] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [audioList, setAudioList] = React.useState([]);

  const selectAudio = async () => {
    InCallManager.start({ media: 'audio' });
    const res = await RNCallKeep.getAudioRoutes();
    if (Platform.OS == 'ios') {
      InCallManager.setForceSpeakerphoneOn(false);
      const checkType =
        res.find((item) => item.type == 'Bluetooth')?.type ?? null;
      if (checkType != null) {
        const audioListTemp = res.filter((item) => item.type != 'Phone');
        setAudioList(audioListTemp);
        setModalVisible(true);
        return;
      } else {
        setAudioList(res);
        setModalVisible(true);
      }
    }
    setAudioList(res);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AudioModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        audioList={audioList}
        callID={callID}
      />
      <View style={styles.headerCallInfo}>
        <Text style={styles.txtDirection}>{direction}...</Text>
        <View style={styles.callInfoContainer}>
          <Text style={styles.txtPhoneNumber}>{phoneNumber}</Text>
          <Clock textClock={textClock} />
        </View>
      </View>
      <View style={styles.groupBtnAction}>
        <View style={styles.advancedBtnGroup}>
          <IconTextButton
            icon={
              mute ? (
                <Image
                  source={require('../../assets/icons/micro-slash.png')}
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/micro.png')}
                  style={{ width: 24, height: 24 }}
                />
              )
            }
            title={'Mute'}
            onPress={() => {
              setMute(!mute);
              if (mute) {
                pitelSDK.unmute();
              } else {
                pitelSDK.mute();
              }
            }}
          />
          <IconTextButton
            icon={
              <Image
                source={require('../../src/assets/icons/volume.png')}
                style={{ width: 24, height: 24 }}
              />
            }
            title={'Speaker'}
            onPress={async () => {
              setSpeaker(!speaker);
              selectAudio();
            }}
          />
        </View>
        <IconButton
          icon={
            <Image
              source={require('../../src/assets/icons/hangup.png')}
              style={{ width: 29, height: 29 }}
            />
          }
          onPress={() => {
            InCallManager.stop();
            onHangup();
          }}
        />
      </View>
    </View>
  );
};
