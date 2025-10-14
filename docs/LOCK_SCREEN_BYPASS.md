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
    // Add this line for lock screen bypass functionality
    packages.add(new PitelVoipPackage());
    return packages;
}
```

### 2. Add to settings.gradle

In your app's `android/settings.gradle`, add:

```gradle
include ':react-native-pitel-voip'
project(':react-native-pitel-voip').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-pitel-voip/android')
```

### 3. Add to app/build.gradle

In your app's `android/app/build.gradle`, add to dependencies:

```gradle
dependencies {
    implementation project(':react-native-pitel-voip')
    // ...existing dependencies
}
```

### 4. Clean and Rebuild

```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
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
