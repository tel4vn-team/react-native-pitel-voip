import * as React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import { Platform } from 'react-native';

export const AudioModal = ({
  modalVisible,
  audioList,
  setModalVisible,
  callID,
}) => {
  const [audioSelected, setAudioSelected] = React.useState('');

  // Case call out
  const selectAudioRoute = async (type) => {
    setAudioSelected(type);
    if (Platform.OS == 'android') {
      selectAudioAndroid(type);
    } else {
      selectAudioIOS(type);
    }
    setModalVisible(!modalVisible);
  };

  // Android
  const selectAudioAndroid = async (type) => {
    const res = await RNCallKeep.getAudioRoutes();
    const typeSelected = res.find((item) => item.type == type).name;

    switch (typeSelected) {
      case 'Speaker':
        await InCallManager.chooseAudioRoute('SPEAKER_PHONE');
        break;
      case 'Bluetooth':
        await InCallManager.chooseAudioRoute('BLUETOOTH');
        break;
      case 'Phone':
        await InCallManager.chooseAudioRoute('EARPIECE');
        break;
    }
    await RNCallKeep.setAudioRoute(callID, typeSelected);
  };

  // IOS
  const selectAudioIOS = async (type) => {
    const res = await RNCallKeep.getAudioRoutes();
    const typeSelected = res.find((item) => item.type == type).name;
    if (typeSelected === 'Speaker') {
      InCallManager.setForceSpeakerphoneOn(true);
    } else {
      InCallManager.setForceSpeakerphoneOn(false);
    }
    await RNCallKeep.setAudioRoute(callID, typeSelected);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Choose audio output</Text>
          <View>
            {audioList.map((item) => {
              return (
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => selectAudioRoute(item.type)}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      {
                        color: item.type == audioSelected ? 'cyan' : 'black',
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    paddingVertical: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
