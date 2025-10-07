import { NativeModules, Platform } from 'react-native';

const { RNAirPlayModule } = NativeModules;

/**
 * AirPlay Manager
 * Provides methods to interact with iOS AirPlay audio routing
 * Only works on iOS devices
 */
class AirPlayManager {
  /**
   * Show native AirPlay picker dialog
   * @returns {Promise<boolean>} - Returns true if picker was shown successfully
   */
  async showAirPlayPicker() {
    if (Platform.OS !== 'ios') {
      console.warn('AirPlay is only available on iOS');
      return false;
    }

    if (!RNAirPlayModule) {
      // Module not linked - this is expected if native files haven't been added to Xcode yet
      return false;
    }

    try {
      const result = await RNAirPlayModule.showAirPlayPicker();
      console.log('[AirPlay] Picker shown successfully');
      return result;
    } catch (error) {
      console.error('[AirPlay] Error showing AirPlay picker:', error);
      return false;
    }
  }

  /**
   * Get all available audio routes
   * @returns {Promise<Array>} - Array of available audio routes
   * Each route object contains: { name, type, uid, isSelected }
   */
  async getAvailableAudioRoutes() {
    if (Platform.OS !== 'ios') {
      return [];
    }

    if (!RNAirPlayModule) {
      return [];
    }

    try {
      const routes = await RNAirPlayModule.getAvailableAudioRoutes();
      console.log('[AirPlay] Available routes:', routes);
      return routes || [];
    } catch (error) {
      console.error('[AirPlay] Error getting audio routes:', error);
      return [];
    }
  }

  /**
   * Get current active audio route
   * @returns {Promise<Object|null>} - Current audio route object or null
   * Route object contains: { name, type, uid }
   */
  async getCurrentAudioRoute() {
    if (Platform.OS !== 'ios') {
      return null;
    }

    if (!RNAirPlayModule) {
      return null;
    }

    try {
      const route = await RNAirPlayModule.getCurrentAudioRoute();
      console.log('[AirPlay] Current route:', route);
      return route;
    } catch (error) {
      console.error('[AirPlay] Error getting current route:', error);
      return null;
    }
  }

  /**
   * Check if AirPlay is currently active
   * @returns {Promise<boolean>} - True if AirPlay is active
   */
  async isAirPlayActive() {
    if (Platform.OS !== 'ios') {
      return false;
    }

    if (!RNAirPlayModule) {
      return false;
    }

    try {
      const isActive = await RNAirPlayModule.isAirPlayActive();
      console.log('[AirPlay] Is active:', isActive);
      return isActive;
    } catch (error) {
      console.error('[AirPlay] Error checking AirPlay status:', error);
      return false;
    }
  }

  /**
   * Check if AirPlay module is available
   * @returns {boolean}
   */
  isAvailable() {
    return Platform.OS === 'ios' && !!RNAirPlayModule;
  }
}

export default new AirPlayManager();
