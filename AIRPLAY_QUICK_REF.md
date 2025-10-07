# 🎯 AirPlay Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Add to Xcode

```
Drag & drop to Xcode:
- ios/RNAirPlayModule.swift
- ios/RNAirPlayModule.m
```

### 2. Rebuild

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### 3. Use

```jsx
import { AirPlayButton } from 'react-native-pitel-voip';
<AirPlayButton />;
```

---

## 💡 Common Usage Patterns

### Pattern 1: Simple Button

```jsx
<AirPlayButton />
```

### Pattern 2: Custom Button

```jsx
<AirPlayButton size={28} tintColor="#007AFF" showLabel={true} />
```

### Pattern 3: With Callbacks

```jsx
<AirPlayButton
  onRouteChanged={(route, isActive) => {
    console.log(route.name);
  }}
/>
```

### Pattern 4: Show Picker Programmatically

```javascript
import { AirPlayManager } from 'react-native-pitel-voip';

await AirPlayManager.showAirPlayPicker();
```

### Pattern 5: Get Current Route

```javascript
const route = await AirPlayManager.getCurrentAudioRoute();
console.log(route.name, route.type);
```

---

## 📋 API Quick Reference

| Method                   | Return                      | Description   |
| ------------------------ | --------------------------- | ------------- |
| `showAirPlayPicker()`    | `Promise<boolean>`          | Show picker   |
| `getCurrentAudioRoute()` | `Promise<AudioRoute\|null>` | Current route |
| `isAirPlayActive()`      | `Promise<boolean>`          | Check active  |
| `isAvailable()`          | `boolean`                   | Check module  |

---

## 🎨 Component Props

| Prop             | Type     | Default |
| ---------------- | -------- | ------- |
| `size`           | number   | 24      |
| `tintColor`      | string   | 'white' |
| `showLabel`      | boolean  | false   |
| `onRouteChanged` | function | -       |

---

## 🐛 Quick Fixes

### "Module not found"

```bash
cd ios && rm -rf build && pod install && cd ..
```

### "Bridging header error"

Add to bridging header:

```objective-c
#import <React/RCTBridgeModule.h>
```

### "Picker doesn't show"

- ✅ Use real iOS device (not simulator)
- ✅ Have AirPlay devices on WiFi

---

## ⚠️ Quick Notes

- 🔴 iOS only
- 🔴 Real device required
- 🔴 WiFi network needed
- ✅ Auto-included in AudioModal

---

## 📖 Full Docs

- [Setup Guide](docs/AIRPLAY_SETUP.md)
- [Examples](src/examples/AirPlayExamples.jsx)
- [Visual Guide](AIRPLAY_VISUAL_GUIDE.md)

---

**Quick Help:** Open `AIRPLAY_COMPLETE.md` for full guide
