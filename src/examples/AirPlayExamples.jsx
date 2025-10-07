/**
 * AirPlay Module - Usage Examples
 *
 * This file demonstrates different ways to use the AirPlay module
 * in your React Native VoIP application.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { AirPlayButton, AirPlayManager } from 'react-native-pitel-voip';

/**
 * Example 1: Simple AirPlay Button
 * Basic usage with default settings
 */
export function SimpleAirPlayExample() {
  return (
    <View style={styles.container}>
      <AirPlayButton />
    </View>
  );
}

/**
 * Example 2: Customized AirPlay Button
 * With custom size, color, and label
 */
export function CustomizedAirPlayExample() {
  return (
    <View style={styles.container}>
      <AirPlayButton
        size={32}
        tintColor="#007AFF"
        showLabel={true}
        label="Audio Output"
        onPress={() => console.log('Opening AirPlay picker...')}
        onRouteChanged={(route, isActive) => {
          console.log('Audio route changed:', {
            name: route?.name,
            type: route?.type,
            isAirPlay: isActive,
          });
        }}
      />
    </View>
  );
}

/**
 * Example 3: Using AirPlayManager Directly
 * Programmatic control without button component
 */
export function ProgrammaticAirPlayExample() {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isAirPlayActive, setIsAirPlayActive] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);

  useEffect(() => {
    loadAudioInfo();
  }, []);

  const loadAudioInfo = async () => {
    if (Platform.OS !== 'ios') return;

    // Get current route
    const route = await AirPlayManager.getCurrentAudioRoute();
    setCurrentRoute(route);

    // Check AirPlay status
    const isActive = await AirPlayManager.isAirPlayActive();
    setIsAirPlayActive(isActive);

    // Get available routes
    const routes = await AirPlayManager.getAvailableAudioRoutes();
    setAvailableRoutes(routes);
  };

  const handleShowPicker = async () => {
    const success = await AirPlayManager.showAirPlayPicker();
    if (success) {
      // Refresh info after user makes selection
      setTimeout(loadAudioInfo, 500);
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.container}>
        <Text>AirPlay is only available on iOS</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Output Info</Text>

      <View style={styles.infoBox}>
        <Text>Current Route: {currentRoute?.name || 'Unknown'}</Text>
        <Text>Type: {currentRoute?.type || 'N/A'}</Text>
        <Text>AirPlay Active: {isAirPlayActive ? 'Yes' : 'No'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleShowPicker}>
        <Text style={styles.buttonText}>Show AirPlay Picker</Text>
      </TouchableOpacity>

      <View style={styles.routesList}>
        <Text style={styles.subtitle}>Available Routes:</Text>
        {availableRoutes.map((route, index) => (
          <Text key={index} style={styles.routeItem}>
            • {route.name} ({route.type}) {route.isSelected ? '✓' : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

/**
 * Example 4: Call Screen with AirPlay
 * Integration in a typical VoIP call screen
 */
export function CallScreenWithAirPlay({ onEndCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  return (
    <View style={styles.callScreen}>
      <View style={styles.callerInfo}>
        <Text style={styles.callerName}>John Doe</Text>
        <Text style={styles.callStatus}>00:05:23</Text>
      </View>

      <View style={styles.controls}>
        {/* Mute Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {/* Speaker Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsSpeaker(!isSpeaker)}
        >
          <Text style={styles.controlText}>
            {isSpeaker ? 'Speaker On' : 'Speaker Off'}
          </Text>
        </TouchableOpacity>

        {/* AirPlay Button */}
        <View style={styles.controlButton}>
          <AirPlayButton
            size={24}
            tintColor="white"
            showLabel={true}
            label="AirPlay"
            onRouteChanged={(route, isActive) => {
              console.log('Audio switched to:', route?.name);
            }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
        <Text style={styles.endCallText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Example 5: Audio Settings Modal with AirPlay
 * Custom modal showing all audio options including AirPlay
 */
export function AudioSettingsModal({ visible, onClose }) {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (visible && Platform.OS === 'ios') {
      loadRoutes();
    }
  }, [visible]);

  const loadRoutes = async () => {
    const available = await AirPlayManager.getAvailableAudioRoutes();
    setRoutes(available);

    const current = await AirPlayManager.getCurrentAudioRoute();
    setSelectedRoute(current);
  };

  const handleSelectAirPlay = async () => {
    await AirPlayManager.showAirPlayPicker();
    setTimeout(() => {
      loadRoutes();
    }, 500);
  };

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Audio Output</Text>

        {routes.map((route, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.routeOption,
              route.uid === selectedRoute?.uid && styles.selectedRoute,
            ]}
            onPress={() => {
              if (route.type === 'AirPlay') {
                handleSelectAirPlay();
              }
            }}
          >
            <Text style={styles.routeName}>{route.name}</Text>
            <Text style={styles.routeType}>{route.type}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.airplayOption}
          onPress={handleSelectAirPlay}
        >
          <Text style={styles.airplayText}>Choose AirPlay Device...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  routesList: {
    width: '100%',
    marginTop: 20,
  },
  routeItem: {
    fontSize: 14,
    marginVertical: 5,
  },
  callScreen: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-around',
    padding: 20,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  callStatus: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    color: 'white',
    marginTop: 5,
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 50,
    alignSelf: 'center',
    width: 200,
  },
  endCallText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  routeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedRoute: {
    backgroundColor: '#e3f2fd',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  airplayOption: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 15,
  },
  airplayText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 15,
    marginTop: 10,
  },
  closeText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});
