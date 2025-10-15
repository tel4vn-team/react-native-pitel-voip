# Changelog

Minor version updates before v1.0.0 can include breaking changes, which will always be listed here.

## 1.1.4 - 2024-10-14

### New Features

#### 🎵 AirPlay Support for iOS

- Add native AirPlay module for iOS audio routing
- New `AirPlayManager` class with methods for audio route management
- New `AirPlayButton` component for easy AirPlay integration
- Support for showing AirPlay picker dialog and checking active status
- Audio route detection and switching capabilities

#### 🔒 Lock Screen Bypass for Android

- Add native Android module for lock screen bypass functionality
- New `LockScreenManager` class for managing lock screen behavior
- Automatic screen wake-up and lock screen bypass for incoming calls
- Support for Android API levels 21+ with proper version handling
- Enhanced incoming call experience on locked devices

#### 🛠️ Enhanced WebRTC Support

- Upgrade to `react-native-webrtc@124.0.6` for better compatibility
- Add WebRTC polyfill and safe patches to prevent crashes
- New architecture (Fabric/TurboModules) compatibility layer
- Improved error handling and debugging for WebRTC initialization
- Fix for "[NSNull UTF8String]: unrecognized selector" crash on iOS

#### 📱 React Native New Architecture Support

- Full compatibility with React Native's new architecture (Fabric)
- Enhanced auto-linking for native modules
- Improved native module initialization and error handling

### Platform-Specific Improvements

#### Android

- Update compile and target SDK to 35
- Enhanced Android 13+ notification permission handling
- Improved CallKeep integration (iOS-only to avoid conflicts)
- Better permission management for POST_NOTIFICATIONS
- Lock screen bypass with proper Android version detection

#### iOS

- AirPlay audio routing integration
- Enhanced CallKeep functionality
- Better audio route management and selection
- Improved background audio mode support

### Dependencies & Configuration

- Update `@react-native-firebase/messaging` to v22.1.0
- Update `pitel-sdk-for-rn` to v0.0.6
- Add `react-native-webrtc@124.0.6` as peer dependency
- Update Google Services to v4.4.0
- Enhanced Podfile configuration for better iOS support

### Developer Experience

- Add comprehensive setup documentation for lock screen bypass
- Add AirPlay setup guide for iOS
- Enhanced error logging and debugging tools
- Better TypeScript support with improved type definitions
- Debug helpers for troubleshooting native module setup

### Bug Fixes

- Fix WebRTC initialization timing issues
- Resolve CallKeep conflicts between platforms
- Fix navigation parameter serialization issues
- Improve notification permission handling on Android 13+
- Fix MediaStream null reference crashes
- Better error handling for missing native modules

### Breaking Changes

- `react-native-webrtc@124.0.6` is now required
- Android minSdkVersion bumped to 24
- iOS deployment target remains 12.0
- Some CallKeep methods now iOS-only to prevent Android conflicts

## 1.1.2 - 2024-09-16

- Support display name outgoing/incoming call.

## 1.1.0-rc.2 - 2024-08-19

- Update "react-native-callkeep" v4.3.13.
- Intergrate package "react-native-full-screen-notification-incoming-call".
- New flow incoming call notification.

## 1.0.29 - 2024-08-19

- Update react-native-callkeep v4.3.13.

## 1.0.28 - 2024-05-22

- Refactor MediaStream.
- Support React native 0.74.x.
- Default enable = true in PitelCallOut.
- Update new docs.

## 1.0.22 - 2024-02-21

- Example for use PitelCallOut other screen.

## 1.0.19 - 2024-02-5

- Check display callkit android.
- Re-register when open app.

## 1.0.3 - 2024-01-26

- Fixed some bugs.
- Config icegathering.

## 1.0.1 - 2024-01-25

- Support connect with bluetooth device

## 1.0.0 - 2023-06-02

- Release version 1.0.0

## 0.0.6 - 2023-06-01

- Dynamic register extension.
- Update documention.

## 0.0.5 - 2023-05-31

- Timer for callscreen.
- Unregister event.

## 0.0.4 - 2023-05-26

- Incoming call when open app.

## 0.0.3 - 2023-05-24

- Outgoing call.
- Mute/ ummute micro.
- On/off loud speaker.

## 0.0.2 - 2023-05-23

- Register extension.

## 0.0.1 - 2023-05-22

- Structure package react-native-pitel voip.
