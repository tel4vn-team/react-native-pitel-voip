import PitelSDK from 'pitel-sdk-for-rn';
import '../utils/webrtc-polyfill';

export const pitelRegister = async ({
  sdkOptions,
  setCallState,
  setReceivedPhoneNumber,
  setReceivedDisplayName,
  extension,
}) => {
  const sdkDelegates = {
    onRegistered() {
      setCallState('REGISTER');
    },
    onUnregistered() {
      setCallState('UNREGISTER');
    },
    onCallCreated(remoteNumber, displayName) {
      setReceivedDisplayName(displayName);
      setCallState('CALL_CREATED');
    },
    onCallReceived(remoteNumber) {
      setReceivedPhoneNumber(remoteNumber);
      setCallState('CALL_RECEIVED');
    },
    onCallAnswered() {
      setCallState('CALL_ANSWERED');
    },
    onCallHangup() {
      setCallState('CALL_HANGUP');
    },
    onCallHold() {
      setCallState('CALL_HOLD');
    },
  };
  const partnerOptions = {
    userAgentString: 'RN Pitel VoIP - v1.0.0',
  };

  // Wait for WebRTC polyfill to be ready
  const waitForWebRTC = async (maxAttempts = 5) => {
    for (let i = 0; i < maxAttempts; i++) {
      if (
        typeof RTCPeerConnection !== 'undefined' &&
        RTCPeerConnection.prototype
      ) {
        console.log('[Pitel] WebRTC is ready');
        return true;
      }
      console.log(
        `[Pitel] Waiting for WebRTC... attempt ${i + 1}/${maxAttempts}`
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return false;
  };

  // Check WebRTC availability
  const webrtcReady = await waitForWebRTC();
  if (!webrtcReady) {
    console.error('[Pitel] WebRTC not available after waiting');
    throw new Error(
      'WebRTC not properly initialized - RTCPeerConnection not available'
    );
  }

  // Validate required parameters
  if (!extension || !sdkOptions) {
    console.error('[Pitel] Missing required parameters:', {
      extension,
      sdkOptions,
    });
    throw new Error('Missing required parameters for PitelSDK');
  }

  // Log WebRTC availability
  console.log('[Pitel] WebRTC Status:', {
    RTCPeerConnection: typeof RTCPeerConnection,
    RTCSessionDescription: typeof RTCSessionDescription,
    RTCIceCandidate: typeof RTCIceCandidate,
    MediaStream: typeof MediaStream,
    hasPrototype: !!RTCPeerConnection.prototype,
    prototypeKeys: RTCPeerConnection.prototype
      ? Object.getOwnPropertyNames(RTCPeerConnection.prototype).slice(0, 10)
      : [],
  });

  // Test basic WebRTC functionality
  try {
    console.log('[Pitel] Testing RTCPeerConnection creation...');
    const testPC = new RTCPeerConnection();
    console.log('[Pitel] ✅ RTCPeerConnection created successfully');
    testPC.close();
  } catch (testError) {
    console.error('[Pitel] ❌ RTCPeerConnection test failed:', testError);
  }

  try {
    let pitelSDK = new PitelSDK(
      'xxx',
      'xxx',
      extension,
      sdkDelegates,
      sdkOptions,
      partnerOptions
    );

    console.log('[Pitel] SDK initialized successfully');
    return pitelSDK;
  } catch (error) {
    console.error('[Pitel] Failed to initialize SDK:', error);
    throw error;
  }
};
