/**
 * Lock Screen Manager Type Definitions
 * TypeScript types for Android lock screen bypass functionality
 */

/**
 * Lock Screen Manager singleton class
 * Manages lock screen bypass functionality for Android
 */
declare class LockScreenManager {
  /**
   * Show app on lock screen when receiving incoming call
   * Only works on Android devices
   * @returns Promise that resolves to true if flags were set successfully
   */
  showOnLockScreen(): Promise<boolean>;

  /**
   * Clear lock screen bypass flags
   * @returns Promise that resolves to true if flags were cleared successfully
   */
  clearLockScreenFlags(): Promise<boolean>;

  /**
   * Check if device is currently locked
   * @returns Promise that resolves to true if device is locked
   */
  isDeviceLocked(): Promise<boolean>;

  /**
   * Wake up screen
   * @returns Promise that resolves to true if screen was woken up successfully
   */
  wakeUpScreen(): Promise<boolean>;

  /**
   * Check if lock screen module is available
   * Returns false on iOS or if module is not properly linked
   * @returns true if module is available
   */
  isAvailable(): boolean;
}

declare const lockScreenManager: LockScreenManager;
export default lockScreenManager;
