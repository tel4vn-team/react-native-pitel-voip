/**
 * Notification Permission Helper for Android
 * Handles notification permissions across different Android versions and react-native-permissions versions
 */

import { Platform, Alert, PermissionsAndroid } from 'react-native';

export const requestNotificationPermission = async () => {
  try {
    console.log('[Pitel] Starting notification permission request');

    if (Platform.OS !== 'android') {
      console.log(
        '[Pitel] iOS platform - using CallKit, no additional permissions needed'
      );
      return { success: true, platform: 'ios' };
    }

    const androidVersion = Platform.Version;
    console.log('[Pitel] Android version:', androidVersion);

    // For Android 13+ (API 33+), we need POST_NOTIFICATIONS permission
    if (androidVersion >= 33) {
      console.log('[Pitel] Android 13+ - attempting notification permission');

      try {
        // Use React Native's built-in PermissionsAndroid for Android 13+
        const granted = await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permission to show incoming calls',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        console.log('[Pitel] Built-in permission result:', granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(
            '[Pitel] ✅ Notification permission granted via built-in API'
          );
          return { success: true, method: 'built-in', granted: true };
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('[Pitel] ⚠️ Notification permission denied');
          return {
            success: false,
            method: 'built-in',
            granted: false,
            reason: 'denied',
          };
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('[Pitel] 🚫 Notification permission permanently denied');

          Alert.alert(
            'Enable Notifications',
            'Please enable notifications in Settings > Apps > [App Name] > Notifications to receive incoming calls',
            [{ text: 'OK', style: 'default' }]
          );

          return {
            success: false,
            method: 'built-in',
            granted: false,
            reason: 'never_ask_again',
          };
        }
      } catch (error) {
        console.error('[Pitel] Built-in permission request failed:', error);
      }
    }

    // For Android < 13, notifications should work by default
    console.log('[Pitel] Android < 13 - notifications should work by default');
    return { success: true, method: 'default', androidVersion };
  } catch (error) {
    console.error('[Pitel] Notification permission error:', error);
    return { success: false, error: error.message };
  }
};

export const checkNotificationPermission = async () => {
  try {
    if (Platform.OS !== 'android') {
      return { granted: true, platform: 'ios' };
    }

    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      const granted = await PermissionsAndroid.check(
        'android.permission.POST_NOTIFICATIONS'
      );
      console.log('[Pitel] Current notification permission status:', granted);
      return { granted, androidVersion, method: 'built-in' };
    }

    // For older Android versions, assume granted
    return { granted: true, androidVersion, method: 'default' };
  } catch (error) {
    console.error('[Pitel] Check notification permission error:', error);
    return { granted: false, error: error.message };
  }
};
