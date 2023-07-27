##### react-native-pitel-voip

# Integrate Voip call to your project

[![N|Solid](https://documents.tel4vn.com/img/pitel-logo.png)](https://documents.tel4vn.com/)

`react-native-pitel-voip` is package support for voip call.

## Demo

![register](src/assets/images/register.png)
![ougoing_call](src/assets/images/ougoing_call.png)

## Pitel Flow

When user make call from Pitel app, Pitel Server pushes a notification for all user login (who receives the call). When user "Accept" call, extension will re-register to receive call.
![Pitel Flow](src/assets/images/pitel_connect_flow.png)

## Features

- Register Extension
- Call
- Hangup
- Turn on/off micro
- Turn on/of speaker

## Installation

1. Install Packages
   Add pubspec.yaml:

```pubspec.yaml
yarn add react-native-pitel-voip
```

2. Installing dependencies into a bare React Native project

```js
yarn add react-native-callkeep@4.3.9 @react-native-firebase/app@18.1.0 @react-native-firebase/messaging@18.1.0 react-native-background-timer@2.4.1 react-native-get-random-values@1.9.0 react-native-incall-manager@4.0.1 react-native-svg@13.9.0 react-native-voip-push-notification@3.3.1 uuid@9.0.0 pitel-react-native-webrtc pitel-sdk-webrtc @react-native-async-storage/async-storage@1.19.1
```

3. Pod install

```pubspec.yaml
cd ios
pod install
```

4. Installing react-native-svg-transformer
   Follow document & setup [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer)

```
yarn add --dev react-native-svg-transformer
```

5. Pushkit/ Push notification - Received VoIP and Wake app from Terminated State.
   Note Please check [PUSH_NOTIF.md](https://github.com/anhquangmobile/react-native-pitel-voip/blob/main/%20PUSH_NOTIF.md). setup Pushkit (for IOS), push notification (for Android).

6. Configure Project

#### Android:

- In file `android/app/src/main/AndroidManifest.xml`

```xml
 <manifest...>
    ...
    // Request permission
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
 </manifest>
```

- In file `android/gradle.properties`

```
android.enableDexingArtifactTransform.desugaring=false
```

#### IOS

- Request permission in file `Info.plist`

```
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone access for voip call</string>
<array>
	<string>fetch</string>
	<string>processing</string>
	<string>remote-notification</string>
	<string>voip</string>
</array>
```

- Make sure platform ios `12.0` in `Podfile`

```js
platform :ios, '12.0'
target 'rn_pitel_demo' do
  config = use_native_modules!

  // Add this
  pod 'Firebase', :modular_headers => true
  pod 'FirebaseCoreInternal', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
```

## Example

Please checkout repo github to get [example](https://github.com/anhquangmobile/rn-pitel-demo)

## Usage

- In file [index.js](https://github.com/anhquangmobile/rn-pitel-demo/blob/main/index.js)

```js
import { NotificationBackground } from 'react-native-pitel-voip'; // Add this line
NotificationBackground(); // Add this line

AppRegistry.registerComponent(appName, () => App);
```

- In file [App.jsx](https://github.com/anhquangmobile/rn-pitel-demo/blob/main/App.jsx)

```js
// Import this
import { PitelSDKProvider } from 'react-native-pitel-voip';
import BackgroundTimer from 'react-native-background-timer';
BackgroundTimer.start();

export default function App() {
  return (
    // Wrap your app with PitelSDKProvider
    <PitelSDKProvider>...</PitelSDKProvider>
  );
}
```

- In file `src/screens/home_screen/index.js`
  Please follow [example](https://github.com/anhquangmobile/rn-pitel-demo/blob/main/src/screens/home_screen/index.js)

> Config sdkOption

```js
const ext = `${EXTENSION}`;
const sipPass = `${EXTENSION_SIP_PASSWORD}`;
const appId = `${BUNDLE_ID}`;
const domainUrl = `${DOMAIN}`;

const sdkOptionsInit = {
  sipDomain: `${DOMAIN}:${PORT}`,
  wssServer: `${WSS_URL}`,
  sipPassword: sipPass,
  bundleId: appId, // Bundle id for IOS
  packageId: appId, // Package id for Android
  teamId: `${TEAM_ID}`, // Team id of Apple developer account
};
```

- Register device token & remove device token

```js
const _registerDeviceToken = async () => {
  const fcmToken = await getFcmToken();
  const deviceToken = Platform.OS == 'android' ? fcmToken : iosPushToken;
  await registerDeviceToken({
    pn_token: deviceToken,
    pn_type: Platform.OS == 'android' ? 'android' : 'ios',
    app_id: appId,
    domain: domainUrl,
    extension: ext,
    app_mode: __DEV__ ? 'dev' : 'production',
    fcm_token: fcmToken,
  });
};

const _removeDeviceToken = async () => {
  const fcmToken = await getFcmToken();
  const deviceToken = Platform.OS == 'android' ? fcmToken : iosPushToken;
  removeDeviceToken({
    pn_token: deviceToken,
    domain: domainUrl,
    extension: ext,
  });
};
```

- Wrap your hone screen component with PitelSDK

```js
return (
  <PitelSDK
    sdkOptionsInit={sdkOptionsInit}
    iosPushToken={iosPushToken}
    setSdkOptions={setSdkOptions}
  >
    <HomeScreenComponent
      navigation={navigation}
      sdkOptions={sdkOptions}
      handleRegisterToken={_registerDeviceToken}
      handleRemoveToken={_removeDeviceToken}
      setIOSPushToken={setIOSPushToken}
    />
  </PitelSDK>
);
```

#### Properties

| Prop           | Description                                     | Type     | Default  |
| -------------- | ----------------------------------------------- | -------- | -------- |
| sdkOptionsInit | your extension info use to login                | Object   | Required |
| iosPushToken   | ios device voip push token                      | String   | Required |
| setSdkOptions  | set sdkOption when your extension login success | Function | Required |

- In file `src/screens/home_screen/home_screen.js`
  [Example](https://github.com/anhquangmobile/rn-pitel-demo/blob/main/src/screens/home_screen/home_screen.js)

```js
// Register your extension to PBX
const {
  callState,
  receivedPhoneNumber,
  registerState,

  setCallState,
  registerFunc,
} = useRegister({
  sdkOptions: sdkOptions,
  setPitelSDK: setPitelSDK,
  extension: ext,
});

return (
  <PitelCallNotif
    callkitSetup={callkitSetup}
    pitelSDK={pitelSDK}
    setCallState={setCallState}
    callState={callState}
    isLogin={isLogin}
    isCallOut={isCallOut}
    setCallID={setCallID}
    sdkOptions={sdkOptions}
    registerFunc={registerFunc}
    setIsCallOut={setIsCallOut}
    onCreated={handleCreated}
    onReceived={handleReceived}
    onHangup={handleHangup}
    onIOSToken={(iosToken) => {
      setIOSPushToken(iosToken);
    }}
  >
    ...
  </PitelCallNotif>
);
```

#### Properties

| Prop         | Description                                      | Type       | Default  |
| ------------ | ------------------------------------------------ | ---------- | -------- |
| pitelSDK     | pitelSDK get from params of route                | Object     | Required |
| callkitSetup | set information for callkit request permission   | Object     | Required |
| setCallState | set call status                                  | () => void | Required |
| isLogin      | app login/logout status                          | bool       | Required |
| isCallOut    | call direction status                            | bool       | Required |
| setCallID    | set call direction                               | () => void | Required |
| sdkOptions   | received sdkOptions when extension login success | Object     | Required |
| registerFunc | register extension                               | () => void | Required |
| setIsCallOut | set call direction is call out                   | () => void | Required |
| onCreated    | make outgoing call                               | () => void | Required |
| onReceived   | received incoming call                           | () => void | Required |
| onHangup     | set hang up                                      | () => void | Required |
| onIOSToken   | ios voip push notification                       | String     | Required |

- In file `src/screens/call_screen/index.js` [Example](https://github.com/anhquangmobile/rn-pitel-demo/blob/main/src/screens/call_screen/index.js)

```js
import React, { useState, useContext } from 'react';
import { PitelCallKit, PitelSDKContext } from 'react-native-pitel-voip';

export const CallScreen = ({ route, navigation }) => {
  const [mute, setMute] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const { pitelSDK } = useContext(PitelSDKContext);

  const { phoneNumber, direction, callState, callID } = route.params;

  return (
    <PitelCallKit
      pitelSDK={pitelSDK}
      callState={callState}
      phoneNumber={phoneNumber}
      direction={direction}
      microState={mute}
      speakerState={speaker}
      callID={callID}
      onHangup={() => {
        pitelSDK.hangup();
      }}
      onMicro={() => {
        setMute(!mute);
      }}
      onSpeaker={() => {
        setSpeaker(!speaker);
      }}
    />
  );
};
```

| Prop         | Description                           | Type     | Default  |
| ------------ | ------------------------------------- | -------- | -------- |
| pitelSDK     | pitelSDK when extension login success | Object   | Required |
| callState    | call status                           | String   | Required |
| direction    | call direction                        | String   | Required |
| microState   | microphone status                     | bool     | Required |
| speakerState | loudspeaker status                    | bool     | Required |
| callID       | incoming call id                      | String   | Required |
| onHangup     | hang up when end call                 | Function | Required |
| onMicro      | on/off microphone                     | Function | Required |
| onSpeaker    | on/off loud speaker                   | Function | Required |

## How to test

Using tryit to test voip call connection & conversation
Link: https://tryit.jssip.net/
Setting:

1. Access to link https://tryit.jssip.net/
2. Enter extension: example 102
3. Click Setting icon
4. Enter information to input field
   ![tryit](src/assets/images/pitel_img_3.png)
5. Save
6. Click icon -> to connect
