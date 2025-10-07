# 🎯 Enable AirPlay Module - Instructions for App Developers

## Current Status

✅ **AirPlay module code is included** in react-native-pitel-voip v1.1.3  
⚠️ **Native iOS files need to be added** to your Xcode project to enable functionality

## Why AirPlay is Not Working Yet

The AirPlay module is **gracefully disabled by default** because:

- It requires native iOS files to be added to your Xcode project
- Without these files, the app will work normally but AirPlay features won't be available
- This is intentional to avoid build errors

## How to Enable AirPlay

### Step 1: Locate Native Files

In your `node_modules/react-native-pitel-voip/ios/` folder, you'll find:

```
ios/
├── RNAirPlayModule.swift
└── RNAirPlayModule.m
```

### Step 2: Add to Xcode Project

1. Open your iOS project in Xcode
2. Right-click on your project in Project Navigator
3. Select "Add Files to [YourProjectName]..."
4. Navigate to `node_modules/react-native-pitel-voip/ios/`
5. Select both files:
   - `RNAirPlayModule.swift`
   - `RNAirPlayModule.m`
6. Make sure these options are checked:
   - ✅ **Copy items if needed**
   - ✅ **Create groups**
   - ✅ **Add to targets: [Your App Target]**

### Step 3: Configure Bridging Header

If this is your first Swift file in the project:

1. Xcode will ask: "Would you like to configure an Objective-C bridging header?"
2. Click **"Create Bridging Header"**
3. A file named `[YourApp]-Bridging-Header.h` will be created

If you already have a bridging header, ensure it contains:

```objective-c
#import <React/RCTBridgeModule.h>
```

### Step 4: Update Info.plist (if not already done)

Add audio background mode to enable audio routing:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
    <string>voip</string>
</array>
```

### Step 5: Clean & Rebuild

```bash
# Clean build
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..

# Rebuild
npx react-native run-ios
```

## Verification

After completing the steps above:

1. **In your app**, AirPlay button will automatically appear in AudioModal (iOS only)
2. **On iOS device** (not simulator), you can tap it to see AirPlay devices
3. **Check console** - you should no longer see "RNAirPlayModule is not available" messages

## Current Behavior (Before Setup)

✅ **App works normally** - No crashes or errors  
✅ **AudioModal shows** - Other audio routes (Speaker, Bluetooth, etc.) work fine  
⚠️ **AirPlay option is hidden** - Will appear after native files are added

## After Setup

✅ **AirPlay option appears** in AudioModal on iOS  
✅ **AirPlay button works** in call screens  
✅ **Can select AirPlay devices** (Apple TV, HomePod, AirPlay speakers)  
✅ **Visual indicator** shows when AirPlay is active

## Troubleshooting

### "Module not found" error after adding files

```bash
cd ios && rm -rf build && pod install && cd ..
npx react-native run-ios --reset-cache
```

### Bridging header not working

Check `Build Settings` → `Objective-C Bridging Header` path is correct:

```
YourApp/YourApp-Bridging-Header.h
```

### AirPlay picker doesn't show

- ✅ Must test on **real iOS device** (not Simulator)
- ✅ Must have **AirPlay devices** on same WiFi network

## Need Help?

See full documentation:

- 📖 [AIRPLAY_QUICK_REF.md](../AIRPLAY_QUICK_REF.md) - Quick reference
- 📖 [AIRPLAY_SETUP.md](./AIRPLAY_SETUP.md) - Full setup guide
- 💡 [AirPlayExamples.jsx](../src/examples/AirPlayExamples.jsx) - Usage examples

## For Library Developers

If you're maintaining react-native-pitel-voip package, all code is ready:

- ✅ Native modules created
- ✅ JavaScript wrapper implemented
- ✅ React components ready
- ✅ TypeScript definitions included
- ✅ Graceful fallback when module not linked

No changes needed to the library code itself!

---

**Note:** This is an **optional feature**. Your app will work perfectly fine without enabling AirPlay. Only enable it if you want to give users the ability to route audio to AirPlay devices.
