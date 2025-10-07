# AirPlay Examples

Thư mục này chứa các examples về cách sử dụng AirPlay module trong ứng dụng React Native VoIP.

## File: `AirPlayExamples.jsx`

File này chứa **5 examples** về cách sử dụng AirPlay module:

### 1. Simple AirPlay Button

Sử dụng cơ bản nhất với settings mặc định.

```jsx
<AirPlayButton />
```

### 2. Customized AirPlay Button

Tùy chỉnh size, color, label và callbacks.

```jsx
<AirPlayButton
  size={32}
  tintColor="#007AFF"
  showLabel={true}
  label="Audio Output"
  onRouteChanged={(route, isActive) => {
    console.log('Route changed:', route.name);
  }}
/>
```

### 3. Using AirPlayManager Directly

Sử dụng AirPlayManager để control programmatically.

```jsx
const route = await AirPlayManager.getCurrentAudioRoute();
await AirPlayManager.showAirPlayPicker();
const isActive = await AirPlayManager.isAirPlayActive();
```

### 4. Call Screen with AirPlay

Tích hợp AirPlay vào màn hình cuộc gọi.

```jsx
<CallScreenWithAirPlay onEndCall={handleEndCall} />
```

### 5. Audio Settings Modal

Modal hiển thị tất cả audio routes bao gồm AirPlay.

```jsx
<AudioSettingsModal visible={true} onClose={handleClose} />
```

## Cách sử dụng examples

### Import example

```jsx
import { SimpleAirPlayExample } from './src/examples/AirPlayExamples';

// Hoặc
import * as AirPlayExamples from './src/examples/AirPlayExamples';
```

### Render example

```jsx
function App() {
  return (
    <View>
      <SimpleAirPlayExample />
    </View>
  );
}
```

## Testing examples

Để test các examples:

1. Copy code từ example bạn muốn test
2. Paste vào component của bạn
3. Chạy trên iOS device thật (không phải simulator)
4. Đảm bảo có AirPlay devices trong mạng WiFi

## Platform Support

- ✅ **iOS**: Tất cả examples hoạt động
- ❌ **Android**: Không hỗ trợ (module sẽ return null/false)
- ❌ **iOS Simulator**: Picker không hoạt động (chỉ có thể test UI)

## Yêu cầu

- iOS device thật
- AirPlay-enabled devices (Apple TV, HomePod, AirPlay speakers)
- Cùng mạng WiFi
- Native module đã được link đúng cách

## Troubleshooting

Nếu examples không hoạt động:

1. Kiểm tra native module đã được add vào Xcode project
2. Rebuild iOS app: `npx react-native run-ios`
3. Kiểm tra console logs để debug
4. Đảm bảo đang test trên device thật, không phải simulator

## More Info

Xem full documentation tại [../docs/AIRPLAY_SETUP.md](../docs/AIRPLAY_SETUP.md)
