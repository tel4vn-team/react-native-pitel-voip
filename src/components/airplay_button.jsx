import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
} from 'react-native';
import AirPlayManager from '../modules/AirPlayManager';

/**
 * AirPlay Button Component
 * Displays a button to trigger AirPlay audio route picker on iOS
 * Only renders on iOS platform
 */
export const AirPlayButton = ({
  style,
  iconSource,
  size = 24,
  tintColor = 'white',
  showLabel = false,
  label = 'AirPlay',
  onPress,
  onRouteChanged,
}) => {
  const [isAirPlayActive, setIsAirPlayActive] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkAirPlayStatus();
    }
  }, []);

  const checkAirPlayStatus = async () => {
    const isActive = await AirPlayManager.isAirPlayActive();
    setIsAirPlayActive(isActive);
  };

  const handlePress = async () => {
    if (Platform.OS !== 'ios') {
      console.warn('AirPlay is only available on iOS');
      return;
    }

    try {
      // Call custom onPress if provided
      if (onPress) {
        onPress();
      }

      // Show AirPlay picker
      await AirPlayManager.showAirPlayPicker();

      // Check status after selection
      setTimeout(async () => {
        const isActive = await AirPlayManager.isAirPlayActive();
        setIsAirPlayActive(isActive);

        // Call callback if provided
        if (onRouteChanged) {
          const currentRoute = await AirPlayManager.getCurrentAudioRoute();
          onRouteChanged(currentRoute, isActive);
        }
      }, 500);
    } catch (error) {
      console.error('Error handling AirPlay button press:', error);
    }
  };

  // Only show on iOS
  if (Platform.OS !== 'ios') {
    return null;
  }

  // Check if module is available
  if (!AirPlayManager.isAvailable()) {
    // Module not linked yet - silently return null
    return null;
  }

  const defaultIcon = require('../assets/icons/audio.png');

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <Image
          source={iconSource || defaultIcon}
          style={[
            styles.icon,
            {
              width: size,
              height: size,
              tintColor: isAirPlayActive ? '#007AFF' : tintColor,
            },
          ]}
          resizeMode="contain"
        />
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: isAirPlayActive ? '#007AFF' : tintColor,
              },
            ]}
          >
            {label}
          </Text>
        )}
        {isAirPlayActive && <View style={styles.activeDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  activeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
});
