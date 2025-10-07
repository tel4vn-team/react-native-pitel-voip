# 🎉 AirPlay Module - Implementation Complete!

> **AirPlay audio routing module cho React Native VoIP apps (iOS)**

[![Platform](https://img.shields.io/badge/platform-iOS-blue.svg)](https://www.apple.com/ios/)
[![React Native](https://img.shields.io/badge/react--native->=0.60-green.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-supported-blue.svg)](https://www.typescriptlang.org/)

---

## 📦 What's Included

✅ **Native iOS Module** - Swift + Objective-C  
✅ **JavaScript API** - Clean & simple wrapper  
✅ **React Components** - Ready-to-use button  
✅ **TypeScript Support** - Full type definitions  
✅ **Documentation** - Complete guides & examples  
✅ **Auto-Integration** - Works with AudioModal

---

## 🚀 Quick Start

### 1. Add Native Files to Xcode

```bash
# Drag & drop these files to your Xcode project:
ios/RNAirPlayModule.swift
ios/RNAirPlayModule.m
```

### 2. Configure Bridging Header

```objective-c
// In [YourApp]-Bridging-Header.h
#import <React/RCTBridgeModule.h>
```

### 3. Update Info.plist

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

### 4. Rebuild

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### 5. Use in Your App

```jsx
import { AirPlayButton } from 'react-native-pitel-voip';

<AirPlayButton size={24} showLabel={true} />;
```

---

## 💡 Usage Examples

### 1. Simple Button

```jsx
import { AirPlayButton } from 'react-native-pitel-voip';

<AirPlayButton />;
```

### 2. Customized Button

```jsx
<AirPlayButton
  size={32}
  tintColor="#007AFF"
  showLabel={true}
  label="Audio Output"
  onRouteChanged={(route, isActive) => {
    console.log('Route:', route.name);
  }}
/>
```

### 3. Programmatic Control

```javascript
import { AirPlayManager } from 'react-native-pitel-voip';

// Show picker
await AirPlayManager.showAirPlayPicker();

// Get current route
const route = await AirPlayManager.getCurrentAudioRoute();
console.log(route.name, route.type);

// Check AirPlay status
const isActive = await AirPlayManager.isAirPlayActive();
```

### 4. In Call Screen

```jsx
<View style={styles.controls}>
  <MuteButton />
  <SpeakerButton />
  <AirPlayButton size={28} showLabel={true} />
  <EndCallButton />
</View>
```

### 5. Auto in AudioModal

```jsx
// AirPlay option tự động xuất hiện trên iOS
<AudioModal
  modalVisible={visible}
  audioList={routes}
  setModalVisible={setVisible}
  callID={callID}
/>
```

---

## 📚 API Reference

### AirPlayManager

| Method                      | Returns                     | Description                   |
| --------------------------- | --------------------------- | ----------------------------- |
| `showAirPlayPicker()`       | `Promise<boolean>`          | Hiển thị native picker dialog |
| `getAvailableAudioRoutes()` | `Promise<AudioRoute[]>`     | Lấy tất cả audio routes       |
| `getCurrentAudioRoute()`    | `Promise<AudioRoute\|null>` | Lấy route hiện tại            |
| `isAirPlayActive()`         | `Promise<boolean>`          | Check AirPlay đang active     |
| `isAvailable()`             | `boolean`                   | Check module có sẵn           |

### AirPlayButton Props

| Prop             | Type        | Default   | Description           |
| ---------------- | ----------- | --------- | --------------------- |
| `style`          | ViewStyle   | -         | Custom style          |
| `iconSource`     | ImageSource | default   | Custom icon           |
| `size`           | number      | 24        | Icon size (px)        |
| `tintColor`      | string      | 'white'   | Icon color            |
| `showLabel`      | boolean     | false     | Show text label       |
| `label`          | string      | 'AirPlay' | Label text            |
| `onPress`        | function    | -         | Press callback        |
| `onRouteChanged` | function    | -         | Route change callback |

### AudioRoute Object

```typescript
interface AudioRoute {
  name: string; // e.g., "iPhone", "Living Room TV"
  type: string; // "Phone", "Speaker", "Bluetooth", "AirPlay"
  uid: string; // Unique identifier
  isSelected?: boolean; // Currently selected
}
```

---

## 📂 File Structure

```
react-native-pitel-voip/
├── ios/                          # Native iOS Module
│   ├── RNAirPlayModule.swift     # Swift implementation
│   ├── RNAirPlayModule.m         # Objective-C bridge
│   └── README.md                 # iOS setup guide
│
├── src/
│   ├── modules/                  # JavaScript Layer
│   │   ├── AirPlayManager.js     # JS wrapper
│   │   └── AirPlayManager.d.ts   # TypeScript types
│   │
│   ├── components/               # React Components
│   │   ├── airplay_button.jsx    # AirPlay button
│   │   ├── airplay_button.d.ts   # TypeScript types
│   │   └── modals/
│   │       └── audio_modal.jsx   # Updated with AirPlay
│   │
│   └── examples/                 # Usage Examples
│       ├── AirPlayExamples.jsx   # 5 examples
│       └── README.md             # Examples guide
│
└── docs/
    └── AIRPLAY_SETUP.md          # Full documentation
```

---

## 📖 Documentation

| Document                                           | Description              |
| -------------------------------------------------- | ------------------------ |
| [AIRPLAY_QUICK_REF.md](AIRPLAY_QUICK_REF.md)       | Quick reference card     |
| [AIRPLAY_COMPLETE.md](AIRPLAY_COMPLETE.md)         | Complete guide           |
| [AIRPLAY_VISUAL_GUIDE.md](AIRPLAY_VISUAL_GUIDE.md) | Visual diagrams          |
| [docs/AIRPLAY_SETUP.md](docs/AIRPLAY_SETUP.md)     | Full setup & API docs    |
| [src/examples/](src/examples/)                     | 5 usage examples         |
| [AIRPLAY_CHECKLIST.md](AIRPLAY_CHECKLIST.md)       | Implementation checklist |

---

## 🎯 Features

✅ Native AirPlay picker  
✅ List all audio routes  
✅ Get current route  
✅ Check AirPlay status  
✅ Visual active indicator  
✅ Customizable button  
✅ TypeScript support  
✅ Platform-aware (iOS only)  
✅ Auto-integration in AudioModal  
✅ Error handling  
✅ Comprehensive docs

---

## ⚠️ Requirements

- **Platform:** iOS only (gracefully handles Android)
- **Device:** Real iOS device required (not Simulator)
- **Network:** AirPlay devices on same WiFi
- **iOS Version:** iOS 11.0+
- **React Native:** 0.60+

---

## 🐛 Troubleshooting

### Module not found

```bash
cd ios && rm -rf build Pods Podfile.lock
pod install
cd .. && npx react-native run-ios
```

### Bridging header error

Add to `[YourApp]-Bridging-Header.h`:

```objective-c
#import <React/RCTBridgeModule.h>
```

### AirPlay picker doesn't show

- ✅ Test on real iOS device (not simulator)
- ✅ Ensure AirPlay devices are on same WiFi
- ✅ Check Info.plist has audio background mode

---

## 🎓 Examples

See [src/examples/AirPlayExamples.jsx](src/examples/AirPlayExamples.jsx) for:

1. **Simple AirPlay Button** - Basic usage
2. **Customized Button** - With styling & callbacks
3. **Programmatic Usage** - Direct manager usage
4. **Call Screen Integration** - In VoIP call UI
5. **Audio Settings Modal** - Custom modal with routes

---

## 📊 Stats

- **Native Code:** ~150 lines (Swift + ObjC)
- **JavaScript:** ~250 lines
- **TypeScript:** Full type support
- **Documentation:** 2000+ lines
- **Examples:** 5 different patterns
- **Total Files:** 16 created/updated

---

## ✨ What's Next?

1. ✅ Add native files to Xcode
2. ✅ Configure bridging header
3. ✅ Update Info.plist
4. ✅ Rebuild app
5. ✅ Test on iOS device with AirPlay
6. ✅ Integrate into your UI

---

## 🙏 Credits

Built with ❤️ for the react-native-pitel-voip package.

---

## 📝 License

Same license as react-native-pitel-voip package.

---

## 🔗 Quick Links

- 📖 [Full Setup Guide](docs/AIRPLAY_SETUP.md)
- 💡 [Usage Examples](src/examples/AirPlayExamples.jsx)
- 🎯 [Quick Reference](AIRPLAY_QUICK_REF.md)
- ✅ [Checklist](AIRPLAY_CHECKLIST.md)
- 🎨 [Visual Guide](AIRPLAY_VISUAL_GUIDE.md)

---

<div align="center">

### 🎊 Ready to Use! 🎊

**Start by reading:** [AIRPLAY_QUICK_REF.md](AIRPLAY_QUICK_REF.md)

</div>
