# New Architecture (Fabric) Setup Guide

## Issues with New Architecture

When using React Native's new architecture (Fabric), you might encounter WebRTC compatibility issues.

## Solutions

### 1. Add Metro Config

Add this to your `metro.config.js`:

```javascript
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      alias: {
        'react-native-webrtc': 'react-native-webrtc',
      },
    },
    transformer: {
      ...defaultConfig.transformer,
      experimentalImportSupport: true,
      unstable_allowRequireContext: true,
    },
  };
})();
```

### 2. Disable New Architecture (Temporary Fix)

If WebRTC still doesn't work, you can temporarily disable new architecture:

#### Android

In `android/gradle.properties`:

```
newArchEnabled=false
```

#### iOS

In `ios/Podfile`:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :fabric_enabled => false,
  :new_arch_enabled => false
)
```

### 3. App Registration Fix

Make sure your main App component is properly registered:

```javascript
// index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Add error boundaries
import { NotificationBackground } from 'react-native-pitel-voip';

// Initialize background notifications
NotificationBackground();

AppRegistry.registerComponent(appName, () => App);
```

### 4. Hermes Compatibility

If using Hermes engine, add to `android/app/build.gradle`:

```gradle
project.ext.react = [
    enableHermes: true, // <- here | clean and rebuild if changing
    hermesCommand: "../node_modules/react-native/sdks/hermesvm/osx-bin/hermesc",
]
```

## Testing

After applying these changes:

1. Clean build: `npx react-native clean`
2. Reset metro cache: `npx react-native start --reset-cache`
3. Rebuild: `npx react-native run-android` or `npx react-native run-ios`
