/**
 * AirPlay Button Component Type Definitions
 */

import { ViewStyle, ImageSourcePropType } from 'react-native';
import { AudioRoute } from '../modules/AirPlayManager';

export interface AirPlayButtonProps {
  /**
   * Custom style for the button container
   */
  style?: ViewStyle;

  /**
   * Custom icon image source
   * If not provided, uses default audio icon
   */
  iconSource?: ImageSourcePropType;

  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number;

  /**
   * Tint color for the icon
   * Changes to blue (#007AFF) when AirPlay is active
   * @default 'white'
   */
  tintColor?: string;

  /**
   * Whether to show label text below icon
   * @default false
   */
  showLabel?: boolean;

  /**
   * Label text to display
   * Only shown if showLabel is true
   * @default 'AirPlay'
   */
  label?: string;

  /**
   * Callback when button is pressed
   * Called before showing AirPlay picker
   */
  onPress?: () => void;

  /**
   * Callback when audio route changes
   * Called after user selects a route from picker
   * @param route - The newly selected audio route (or null)
   * @param isAirPlayActive - Whether AirPlay is now active
   */
  onRouteChanged?: (route: AudioRoute | null, isAirPlayActive: boolean) => void;
}

/**
 * AirPlay Button Component
 *
 * Displays a button to trigger AirPlay audio route picker on iOS.
 * Shows an active indicator when AirPlay is currently in use.
 *
 * Only renders on iOS platform. Returns null on Android.
 *
 * @example
 * ```tsx
 * import { AirPlayButton } from 'react-native-pitel-voip';
 *
 * function CallScreen() {
 *   return (
 *     <AirPlayButton
 *       size={28}
 *       tintColor="white"
 *       showLabel={true}
 *       onRouteChanged={(route, isActive) => {
 *         console.log('Route changed:', route?.name);
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export declare const AirPlayButton: React.FC<AirPlayButtonProps>;
