# iOS AirPlay Module

## Quick Setup

### 1. Add to Xcode

Drag these files to your Xcode project:

- `RNAirPlayModule.swift`
- `RNAirPlayModule.m`

### 2. Bridging Header

If prompted, create bridging header with:

```objective-c
#import <React/RCTBridgeModule.h>
```

### 3. Info.plist

Add audio background mode:

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

## Usage

```javascript
import { AirPlayButton, AirPlayManager } from 'react-native-pitel-voip';

// Use button component
<AirPlayButton size={24} tintColor="white" />;

// Or use manager directly
await AirPlayManager.showAirPlayPicker();
```

See [../docs/AIRPLAY_SETUP.md](../docs/AIRPLAY_SETUP.md) for detailed documentation.
