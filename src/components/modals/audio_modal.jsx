import * as React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
// Only import RNCallKeep on iOS to avoid Android conflicts
let RNCallKeep;
if (Platform.OS === 'ios') {
  RNCallKeep = require('react-native-callkeep').default;
}
import AirPlayManager from '../../modules/AirPlayManager';

export const AudioModal = ({
  modalVisible,
  audioList,
  setModalVisible,
  callID,
}) => {
  const [audioSelected, setAudioSelected] = React.useState('');
  const [currentRoute, setCurrentRoute] = React.useState(null);

  // Check current audio route when modal opens (iOS only)
  React.useEffect(() => {
    if (Platform.OS === 'ios' && modalVisible) {
      checkCurrentRoute();
    }
  }, [modalVisible]);

  const checkCurrentRoute = async () => {
    const route = await AirPlayManager.getCurrentAudioRoute();
    setCurrentRoute(route);
    if (route) {
      setAudioSelected(route.type);
    }
  };

  // Case call out
  const selectAudioRoute = async (type) => {
    setAudioSelected(type);

    // Handle AirPlay selection
    if (type === 'AirPlay' && Platform.OS === 'ios') {
      await AirPlayManager.showAirPlayPicker();
      setModalVisible(!modalVisible);
      return;
    }

    if (Platform.OS == 'android') {
      selectAudioAndroid(type);
    } else {
      selectAudioIOS(type);
    }
    setModalVisible(!modalVisible);
  };

  // Android
  const selectAudioAndroid = async (type) => {
    // Android doesn't use RNCallKeep, just use InCallManager directly
    switch (type) {
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
  };

  // IOS
  const selectAudioIOS = async (type) => {
    if (RNCallKeep) {
      const res = await RNCallKeep.getAudioRoutes();
      const typeSelected = res.find((item) => item.type == type).name;
      if (typeSelected === 'Speaker') {
        InCallManager.setForceSpeakerphoneOn(true);
      } else {
        InCallManager.setForceSpeakerphoneOn(false);
      }
      await RNCallKeep.setAudioRoute(callID, typeSelected);
    }
  };

  // Add AirPlay option to audioList for iOS
  const enhancedAudioList = React.useMemo(() => {
    if (Platform.OS === 'ios' && AirPlayManager.isAvailable()) {
      // Check if AirPlay already exists in the list
      const hasAirPlay = audioList.some((item) => item.type === 'AirPlay');
      if (!hasAirPlay) {
        return [...audioList, { name: 'AirPlay', type: 'AirPlay' }];
      }
    }
    return audioList;
  }, [audioList]);

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
            {enhancedAudioList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`${item.type}-${index}`}
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
