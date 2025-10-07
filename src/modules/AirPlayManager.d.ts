/**
 * AirPlay Module Type Definitions
 * TypeScript types for iOS AirPlay audio routing
 */

/**
 * Audio route information
 */
export interface AudioRoute {
  /** Display name of the audio route */
  name: string;
  /** Type of audio route (Speaker, Phone, Bluetooth, AirPlay, etc.) */
  type: string;
  /** Unique identifier for the route */
  uid: string;
  /** Whether this route is currently selected (only in getAvailableAudioRoutes) */
  isSelected?: boolean;
}

/**
 * AirPlay Manager singleton class
 * Provides methods to interact with iOS AirPlay audio routing
 */
declare class AirPlayManager {
  /**
   * Show native AirPlay picker dialog
   * Only works on iOS devices
   * @returns Promise that resolves to true if picker was shown successfully
   */
  showAirPlayPicker(): Promise<boolean>;

  /**
   * Get all available audio routes
   * @returns Promise that resolves to array of available audio routes
   */
  getAvailableAudioRoutes(): Promise<AudioRoute[]>;

  /**
   * Get current active audio route
   * @returns Promise that resolves to current audio route or null
   */
  getCurrentAudioRoute(): Promise<AudioRoute | null>;

  /**
   * Check if AirPlay is currently active
   * @returns Promise that resolves to true if AirPlay is active
   */
  isAirPlayActive(): Promise<boolean>;

  /**
   * Check if AirPlay module is available
   * Returns false on Android or if module is not properly linked
   * @returns true if module is available
   */
  isAvailable(): boolean;
}

declare const airPlayManager: AirPlayManager;
export default airPlayManager;
