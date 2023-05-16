import PitelSDK from 'pitel-sdk-webrtc';

export const pitelRegister = (sdkOptions) => {
    const sdkDelegates = {
        onRegistered() {
        },
        onUnregistered() {
        },
        onCallCreated(remoteNumber) {
        },
        onCallReceived(remoteNumber) {
            pitelSDK.accept();
        },
        onCallAnswered() {
        },
        onCallHangup() {
        },
        onCallHold() {
        },
    };
    let pitelSDK = new PitelSDK('xxx', 'xxx', '103', sdkDelegates, sdkOptions);
    return pitelSDK;
}