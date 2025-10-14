import { NativeModules, Platform } from 'react-native';

const { LockScreenModule } = NativeModules;

/**
 * Lock Screen Manager
 * Manages lock screen bypass functionality for Android
 */
class LockScreenManager {
  /**
   * Show app on lock screen when receiving incoming call
   * @returns {Promise<boolean>} - Returns true if successfully set flags
   */
  async showOnLockScreen() {
    if (Platform.OS !== 'android') {
      console.warn('Lock screen bypass is only available on Android');
      return false;
    }

    if (!LockScreenModule) {
      console.error('LockScreenModule not available');
      return false;
    }

    try {
      const result = await LockScreenModule.showOnLockScreen();
      console.log('[LockScreen] Show on lock screen flags set successfully');
      return result;
    } catch (error) {
      console.error('[LockScreen] Error setting lock screen flags:', error);
      return false;
    }
  }

  /**
   * Clear lock screen bypass flags
   * @returns {Promise<boolean>} - Returns true if successfully cleared flags
   */
  async clearLockScreenFlags() {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (!LockScreenModule) {
      return false;
    }

    try {
      const result = await LockScreenModule.clearLockScreenFlags();
      console.log('[LockScreen] Lock screen flags cleared successfully');
      return result;
    } catch (error) {
      console.error('[LockScreen] Error clearing lock screen flags:', error);
      return false;
    }
  }

  /**
   * Check if device is currently locked
   * @returns {Promise<boolean>} - Returns true if device is locked
   */
  async isDeviceLocked() {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (!LockScreenModule) {
      return false;
    }

    try {
      const isLocked = await LockScreenModule.isDeviceLocked();
      console.log('[LockScreen] Device lock status:', isLocked);
      return isLocked;
    } catch (error) {
      console.error('[LockScreen] Error checking device lock status:', error);
      return false;
    }
  }

  /**
   * Wake up screen
   * @returns {Promise<boolean>} - Returns true if successfully woke up screen
   */
  async wakeUpScreen() {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (!LockScreenModule) {
      return false;
    }

    try {
      const result = await LockScreenModule.wakeUpScreen();
      console.log('[LockScreen] Screen woken up successfully');
      return result;
    } catch (error) {
      console.error('[LockScreen] Error waking up screen:', error);
      return false;
    }
  }

  /**
   * Check if module is available
   * @returns {boolean}
   */
  isAvailable() {
    return Platform.OS === 'android' && !!LockScreenModule;
  }
}

export default new LockScreenManager();
