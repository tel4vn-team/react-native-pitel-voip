import * as React from 'react';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import { Platform } from 'react-native';

export const AudioModal = ({
  modalVisible,
  audioList,
  setModalVisible,
  callID,
}) => {
  // Case call out
  const selectAudioRoute = async (type) => {
    setModalVisible(!modalVisible);
    const res = await RNCallKeep.getAudioRoutes();

    if (Platform.OS == 'android') {
    }
    // IOS
    const typeSelected = res.find((item) => item.type == type).name;
    if (typeSelected === 'Speaker') {
      InCallManager.setForceSpeakerphoneOn(true);
    } else {
      InCallManager.setForceSpeakerphoneOn(false);
    }
    await RNCallKeep.setAudioRoute(callID, typeSelected);
  };

  return (
    <View style={styles.centeredView}>
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
                  <Pressable
                    style={[styles.button]}
                    onPress={() => selectAudioRoute(item.type)}
                  >
                    <Text style={styles.textStyle}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
  },
});
