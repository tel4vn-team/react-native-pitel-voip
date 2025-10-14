# React Native Pitel VoIP - Installation Guide

## 🚀 Quick Installation (Auto-linking)

### 1. Install package:

```bash
npm install react-native-pitel-voip
# or
yarn add react-native-pitel-voip
```

### 2. For Android - Clean and rebuild:

```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### 3. For iOS - Install pods:

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### 4. That's it! 🎉

**Lock screen bypass feature will work automatically on Android!**

## ✅ Verify Installation:

```javascript
import { LockScreenManager } from 'react-native-pitel-voip';

// Check if auto-linking worked
console.log('Lock screen available:', LockScreenManager.isAvailable());

// Debug setup info
LockScreenManager.debugSetup();
```

## Expected Output (Success):

```
Platform: android
Module Available: true
✅ Auto-linking successful! Module ready to use.
```

## 🔧 Troubleshooting

If you see "LockScreenModule not available":

### Option 1: Try clean rebuild

```bash
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
npx react-native run-android
```

### Option 2: Manual setup (if auto-linking fails)

1. **Add to `android/settings.gradle`:**

```gradle
include ':react-native-pitel-voip'
project(':react-native-pitel-voip').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-pitel-voip/android')
```

2. **Add to `android/app/build.gradle`:**

```gradle
dependencies {
    implementation project(':react-native-pitel-voip')
    // ...other dependencies
}
```

3. **Add to `MainApplication.java`:**

```java
import com.reactnativepitelvoip.PitelVoipPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new PitelVoipPackage() // Add this line
    );
}
```

4. **Clean and rebuild:**

```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

## 🎯 Features

- ✅ **Auto-linking support** (React Native 0.60+)
- ✅ **Lock screen bypass** (Android only)
- ✅ **Screen wake up** (Android only)
- ✅ **Cross-platform safe** (iOS compatible)
- ✅ **TypeScript support**

## 📱 Usage

The lock screen bypass feature works automatically with `PitelCallNotif` component:

```javascript
import { PitelCallNotif } from 'react-native-pitel-voip';

// Lock screen bypass is automatically enabled for incoming calls
<PitelCallNotif {...yourProps} />;
```

Manual usage:

```javascript
import { LockScreenManager } from 'react-native-pitel-voip';

// Check if device is locked
const isLocked = await LockScreenManager.isDeviceLocked();

// Show on lock screen
if (isLocked) {
  await LockScreenManager.showOnLockScreen();
  await LockScreenManager.wakeUpScreen();
}

// Clean up when done
await LockScreenManager.clearLockScreenFlags();
```
