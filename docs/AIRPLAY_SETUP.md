# AirPlay Module - iOS Setup Guide

## Tổng quan

Module AirPlay cho phép user chọn đầu ra audio (AirPlay devices, Bluetooth, Speaker, etc.) trong ứng dụng VoIP của bạn.

## Các file đã tạo

### 1. Native iOS Module

- `ios/RNAirPlayModule.swift` - Swift module xử lý AirPlay routing
- `ios/RNAirPlayModule.m` - Objective-C bridge cho React Native

### 2. JavaScript Layer

- `src/modules/AirPlayManager.js` - JavaScript wrapper cho native module
- `src/components/airplay_button.jsx` - React component button AirPlay

### 3. Updated Components

- `src/components/modals/audio_modal.jsx` - Đã thêm AirPlay option
- `src/index.tsx` - Đã export AirPlayManager và AirPlayButton

## Cài đặt trong iOS Project

### Bước 1: Thêm Native Files vào Xcode Project

1. Mở Xcode workspace của project React Native app sử dụng library này
2. Tìm folder chứa native modules (thường là `node_modules/react-native-pitel-voip/ios`)
3. Kéo thả 2 files sau vào Xcode project:
   - `RNAirPlayModule.swift`
   - `RNAirPlayModule.m`
4. Khi được hỏi, chọn:
   - ✅ Copy items if needed
   - ✅ Create groups
   - ✅ Add to targets: [Your App Target]

### Bước 2: Tạo Bridging Header (nếu chưa có)

Nếu project của bạn chưa có Swift bridging header:

1. Xcode sẽ tự động hỏi "Would you like to configure an Objective-C bridging header?"
2. Click **"Create Bridging Header"**
3. File `[YourApp]-Bridging-Header.h` sẽ được tạo

Nếu đã có bridging header, đảm bảo nó import React Native:

```objective-c
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
```

### Bước 3: Cấu hình Audio Session (Info.plist)

Thêm các permission vào `Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
    <string>voip</string>
</array>
```

### Bước 4: Rebuild Project

```bash
# Clean build
cd ios
rm -rf Pods Podfile.lock
pod install

# Hoặc
cd ios && pod install && cd ..

# Rebuild
npx react-native run-ios
```

## Sử dụng

### 1. Sử dụng AirPlayButton Component

```javascript
import { AirPlayButton } from 'react-native-pitel-voip';

function CallScreen() {
  return (
    <View>
      <AirPlayButton
        size={24}
        tintColor="white"
        showLabel={true}
        label="AirPlay"
        onPress={() => console.log('AirPlay button pressed')}
        onRouteChanged={(route, isActive) => {
          console.log('Audio route changed:', route, isActive);
        }}
      />
    </View>
  );
}
```

### 2. Sử dụng AirPlayManager Trực tiếp

```javascript
import { AirPlayManager } from 'react-native-pitel-voip';

// Hiển thị AirPlay picker
async function showPicker() {
  const success = await AirPlayManager.showAirPlayPicker();
  console.log('Picker shown:', success);
}

// Lấy audio route hiện tại
async function getCurrentRoute() {
  const route = await AirPlayManager.getCurrentAudioRoute();
  console.log('Current route:', route);
  // Output: { name: "iPhone", type: "Phone", uid: "..." }
}

// Lấy tất cả audio routes
async function getRoutes() {
  const routes = await AirPlayManager.getAvailableAudioRoutes();
  console.log('Available routes:', routes);
}

// Check AirPlay đang active
async function checkAirPlay() {
  const isActive = await AirPlayManager.isAirPlayActive();
  console.log('AirPlay is active:', isActive);
}

// Check module available
if (AirPlayManager.isAvailable()) {
  console.log('AirPlay module is ready');
}
```

### 3. AudioModal đã tự động có AirPlay

Component `AudioModal` đã được cập nhật để tự động hiển thị option AirPlay trên iOS:

```javascript
import { AudioModal } from 'react-native-pitel-voip';

function MyComponent() {
  const [modalVisible, setModalVisible] = useState(false);
  const audioList = [
    { name: 'Phone', type: 'Phone' },
    { name: 'Speaker', type: 'Speaker' },
    { name: 'Bluetooth', type: 'Bluetooth' },
    // AirPlay sẽ tự động được thêm trên iOS
  ];

  return (
    <AudioModal
      modalVisible={modalVisible}
      audioList={audioList}
      setModalVisible={setModalVisible}
      callID={callID}
    />
  );
}
```

## API Reference

### AirPlayManager

#### Methods

##### `showAirPlayPicker(): Promise<boolean>`

Hiển thị native AirPlay picker dialog.

**Returns:** `true` nếu picker được hiển thị thành công

##### `getAvailableAudioRoutes(): Promise<Array>`

Lấy danh sách tất cả audio routes có sẵn.

**Returns:** Array of route objects:

```javascript
[
  {
    name: 'iPhone',
    type: 'Phone',
    uid: 'Built-In Receiver',
    isSelected: true,
  },
];
```

##### `getCurrentAudioRoute(): Promise<Object|null>`

Lấy audio route hiện đang active.

**Returns:** Route object hoặc `null`

##### `isAirPlayActive(): Promise<boolean>`

Kiểm tra AirPlay có đang active không.

**Returns:** `true` nếu AirPlay đang được sử dụng

##### `isAvailable(): boolean`

Kiểm tra module có sẵn không (chỉ iOS).

**Returns:** `true` nếu module được link đúng cách

### AirPlayButton

#### Props

| Prop             | Type        | Default      | Description                       |
| ---------------- | ----------- | ------------ | --------------------------------- |
| `style`          | ViewStyle   | -            | Custom style cho button           |
| `iconSource`     | ImageSource | default icon | Custom icon image                 |
| `size`           | number      | 24           | Kích thước icon                   |
| `tintColor`      | string      | 'white'      | Màu của icon                      |
| `showLabel`      | boolean     | false        | Hiển thị label text               |
| `label`          | string      | 'AirPlay'    | Text label                        |
| `onPress`        | function    | -            | Callback khi button được press    |
| `onRouteChanged` | function    | -            | Callback khi audio route thay đổi |

## Troubleshooting

### Module not found

```
Error: RNAirPlayModule is not available
```

**Solution:**

1. Đảm bảo đã thêm files Swift và Objective-C vào Xcode project
2. Clean build: `cd ios && rm -rf build && cd ..`
3. Reinstall pods: `cd ios && pod install && cd ..`
4. Rebuild: `npx react-native run-ios`

### Bridging header error

```
'React/RCTBridgeModule.h' file not found
```

**Solution:**

1. Mở file bridging header `[YourApp]-Bridging-Header.h`
2. Thêm:

```objective-c
#import <React/RCTBridgeModule.h>
```

### AirPlay picker không hiển thị

```
Could not show AirPlay picker
```

**Solution:**

1. Đảm bảo đang chạy trên iOS device thật (không phải simulator)
2. Kiểm tra có AirPlay devices trong mạng
3. Kiểm tra audio session permissions trong Info.plist

### Chỉ hoạt động trên iOS

AirPlay chỉ có trên iOS. Trên Android, module sẽ return `false` hoặc empty results.

## Notes

- AirPlay chỉ hoạt động trên **iOS devices thật**, không hoạt động trên iOS Simulator
- Cần có AirPlay-enabled devices (Apple TV, HomePod, AirPlay speakers) trong cùng mạng WiFi
- Module tự động check platform và chỉ chạy trên iOS
- Audio session cần được configure đúng cách để AirPlay hoạt động

## Example Usage in Call Screen

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AirPlayButton, AirPlayManager } from 'react-native-pitel-voip';

function CallScreen() {
  const handleRouteChange = async (route, isActive) => {
    console.log('Audio route changed to:', route?.name);
    if (isActive) {
      console.log('AirPlay is now active');
    }
  };

  return (
    <View style={styles.container}>
      {/* Other call controls */}

      <AirPlayButton
        size={28}
        tintColor="#007AFF"
        showLabel={true}
        onRouteChanged={handleRouteChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Phát triển thêm

Nếu cần customize thêm, bạn có thể:

1. Mở `ios/RNAirPlayModule.swift` để thêm methods
2. Update `ios/RNAirPlayModule.m` để expose methods mới
3. Update `src/modules/AirPlayManager.js` để wrap JavaScript methods
4. Update TypeScript types nếu cần

## License

Cùng license với react-native-pitel-voip package.
