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
      console.error(
        'LockScreenModule not available - Please follow setup instructions:'
      );
      console.error('1. Add PitelVoipPackage to MainApplication.java');
      console.error(
        "2. Add to settings.gradle: include ':react-native-pitel-voip'"
      );
      console.error(
        "3. Add to app/build.gradle: implementation project(':react-native-pitel-voip')"
      );
      console.error(
        '4. Clean and rebuild: cd android && ./gradlew clean && cd .. && npx react-native run-android'
      );
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

  /**
   * Debug helper - prints module status and setup instructions
   */
  debugSetup() {
    console.log('=== LockScreenManager Debug Info ===');
    console.log('Platform:', Platform.OS);
    console.log('LockScreenModule available:', !!LockScreenModule);

    if (Platform.OS === 'android' && !LockScreenModule) {
      console.log('\n❌ Auto-linking failed. Try these steps:');
      console.log('1. Clean and rebuild:');
      console.log('   cd android && ./gradlew clean && cd ..');
      console.log('   npx react-native run-android');
      console.log(
        '\n2. If still failing, check INSTALLATION_GUIDE.md for manual setup'
      );
      console.log('\n3. For React Native < 0.60, manual linking required');
    } else if (Platform.OS === 'android' && LockScreenModule) {
      console.log('✅ Auto-linking successful! Module ready to use.');
    } else {
      console.log('ℹ️ Lock screen bypass is only available on Android');
    }
    console.log('=====================================');
  }
}

export default new LockScreenManager();
