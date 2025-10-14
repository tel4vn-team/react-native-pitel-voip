# Lock Screen Bypass Feature for Android

This feature allows the Pitel VoIP app to bypass the lock screen on Android devices when receiving incoming calls, providing a better user experience.

## Overview

The Lock Screen Manager provides functionality to:

- Show the app on lock screen during incoming calls
- Wake up the screen automatically
- Check device lock status
- Clear lock screen flags when call ends

## Setup Instructions

### 1. Android Native Module Registration

In your main app's `MainApplication.java` (or `MainApplication.kt`), add the Pitel VoIP package:

```java
import com.reactnativepitelvoip.PitelVoipPackage;

@Override
protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Add this line
    packages.add(new PitelVoipPackage());
    return packages;
}
```

### 2. Android Permissions

The following permissions are automatically included in the library's AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.DISABLE_KEYGUARD" />
<uses-permission android:name="android.permission.SHOW_WHEN_LOCKED" />
<uses-permission android:name="android.permission.TURN_SCREEN_ON" />
```

### 3. Main Activity Configuration (Optional)

For additional lock screen support, you can add these attributes to your MainActivity in `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop"
    android:theme="@style/AppTheme"
    android:showWhenLocked="true"
    android:turnScreenOn="true">
    <!-- existing intent filters -->
</activity>
```

## Usage

### Automatic Integration

The lock screen bypass feature is automatically integrated into the `PitelCallNotif` component. When an incoming call is received on Android, the system will:

1. Check if the device is locked
2. If locked, show the app on lock screen
3. Wake up the screen
4. Clear the flags when the call ends

### Manual Usage

You can also use the `LockScreenManager` directly:

```javascript
import { LockScreenManager } from 'react-native-pitel-voip';

// Check if device is locked
const isLocked = await LockScreenManager.isDeviceLocked();

// Show on lock screen
if (isLocked) {
  await LockScreenManager.showOnLockScreen();
  await LockScreenManager.wakeUpScreen();
}

// Clear flags when done
await LockScreenManager.clearLockScreenFlags();

// Check if module is available
if (LockScreenManager.isAvailable()) {
  // Module is available and ready to use
}
```

## API Reference

### Methods

#### `showOnLockScreen(): Promise<boolean>`

- Shows the app on lock screen when device is locked
- Only works on Android
- Returns `true` if flags were set successfully

#### `clearLockScreenFlags(): Promise<boolean>`

- Clears the lock screen bypass flags
- Returns `true` if flags were cleared successfully

#### `isDeviceLocked(): Promise<boolean>`

- Checks if the device is currently locked
- Returns `true` if device is locked

#### `wakeUpScreen(): Promise<boolean>`

- Wakes up the screen
- Returns `true` if screen was woken up successfully

#### `isAvailable(): boolean`

- Checks if the lock screen module is available
- Returns `false` on iOS or if module is not properly linked

## Platform Support

- ✅ **Android**: Full support for lock screen bypass
- ❌ **iOS**: Not supported (iOS has its own CallKit integration)

## Android Version Compatibility

- **Android 8.1+ (API 27+)**: Uses modern `setShowWhenLocked()` and `setTurnScreenOn()` methods
- **Android 10+ (API 29+)**: Additional support for `requestDismissKeyguard()`
- **Android < 8.1**: Uses legacy window flags

## Troubleshooting

### Module Not Found Error

If you get a "LockScreenModule not found" error:

1. Make sure you've added `PitelVoipPackage` to your `MainApplication.java`
2. Clean and rebuild your Android project:
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

### Permissions Issues

If the lock screen bypass doesn't work:

1. Check that all required permissions are granted
2. Some Android manufacturers may have additional restrictions
3. Test on different devices to ensure compatibility

### Screen Not Waking Up

If the screen doesn't wake up:

1. Ensure `WAKE_LOCK` permission is granted
2. Some devices may have power saving modes that interfere
3. Check device-specific settings for app wake-up permissions

## Security Considerations

- The lock screen bypass only works when the app is actively receiving a call
- Flags are automatically cleared when the call ends
- The feature respects Android's security model and doesn't permanently bypass security

## Example Implementation

```javascript
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { PitelCallNotif, LockScreenManager } from 'react-native-pitel-voip';

export const MyCallComponent = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      console.log(
        'Lock Screen Manager available:',
        LockScreenManager.isAvailable()
      );
    }
  }, []);

  const handleIncomingCall = async () => {
    if (Platform.OS === 'android') {
      const isLocked = await LockScreenManager.isDeviceLocked();
      if (isLocked) {
        console.log('Device is locked, showing on lock screen');
      }
    }
  };

  return (
    <PitelCallNotif
      // ... your existing props
      onReceived={handleIncomingCall}
    />
  );
};
```

This feature enhances the user experience by ensuring incoming calls are visible even when the device is locked, following Android's best practices for VoIP applications.
