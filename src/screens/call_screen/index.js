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
// Only import RNCallKeep on iOS to avoid Android conflicts
let RNCallKeep;
if (Platform.OS === 'ios') {
  RNCallKeep = require('react-native-callkeep').default;
}
import { btoa, atob } from 'react-native-quick-base64';
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import styles from './styles';

import { decodeDisplayName } from '../../utils/display_name_helper';
import { IconTextButton } from '../../components/icon_text_button';
import { IconButton } from '../../components/icon_button';

import { Clock } from '../../components/clock/clock';
import { AudioModal } from '../../components/modals/audio_modal';

import AirPlayManager from '../../modules/AirPlayManager';

export const PitelCallKit = ({
  callID,
  pitelSDK,
  onHangup,

  textClock,
  phoneNumber,
  displayName,
  direction,
  callState,
}) => {
  const [mute, setMute] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [audioList, setAudioList] = React.useState([]);

  const selectAudio = async () => {
    InCallManager.start({ media: 'audio' });

    if (Platform.OS == 'ios' && RNCallKeep) {
      const res = await RNCallKeep.getAudioRoutes();
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
    } else if (Platform.OS == 'android') {
      // Android - use InCallManager for audio routes
      const audioRoutes = [
        { type: 'Speaker', name: 'Speaker' },
        { type: 'Bluetooth', name: 'Bluetooth' },
        { type: 'Phone', name: 'Phone' },
      ];
      setAudioList(audioRoutes);
      setModalVisible(true);
    }
  };

  const nameCaller = decodeDisplayName({
    displayNameRaw: displayName,
    phoneNumber: phoneNumber,
  });

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
          <Text style={styles.txtPhoneNumber}>
            {nameCaller != '' ? nameCaller : phoneNumber}
          </Text>
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
                source={require('../../assets/icons/volume.png')}
                style={{ width: 24, height: 24 }}
              />
            }
            title={'Speaker'}
            onPress={async () => {
              switch (Platform.OS) {
                case 'android':
                  setSpeaker(!speaker);
                  selectAudio();
                  break;
                case 'ios':
                  if (AirPlayManager.isAvailable()) {
                    setSpeaker(!speaker);
                    await AirPlayManager.showAirPlayPicker();
                  }
                  break;
              }
            }}
          />
        </View>
        <IconButton
          icon={
            <Image
              source={require('../../assets/icons/hangup.png')}
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
