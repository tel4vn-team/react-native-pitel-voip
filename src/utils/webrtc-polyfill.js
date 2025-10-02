// Import WebRTC components with error handling
let webrtcComponents = {};
try {
  const webrtc = require('react-native-webrtc');
  webrtcComponents = {
    mediaDevices: webrtc.mediaDevices,
    MediaStream: webrtc.MediaStream,
    MediaStreamTrack: webrtc.MediaStreamTrack,
    MediaStreamTrackEvent: webrtc.MediaStreamTrackEvent,
    RTCIceCandidate: webrtc.RTCIceCandidate,
    RTCPeerConnection: webrtc.RTCPeerConnection,
    RTCSessionDescription: webrtc.RTCSessionDescription,
    RTCRtpSender: webrtc.RTCRtpSender,
    RTCRtpTransceiver: webrtc.RTCRtpTransceiver,
  };
  console.log(
    '[WebRTC Polyfill] Successfully imported react-native-webrtc components'
  );
} catch (error) {
  console.error(
    '[WebRTC Polyfill] Failed to import react-native-webrtc:',
    error
  );
}

console.log(
  '[WebRTC Polyfill] Initializing with components:',
  Object.keys(webrtcComponents)
);

// Import new architecture compatibility
const {
  initWebRTCForNewArch,
  logArchitectureInfo,
} = require('./new_arch_compat');

// Log architecture information
logArchitectureInfo();

// Initialize new architecture compatibility
initWebRTCForNewArch();

/* 🔧 Enhanced Polyfill cho SIP.js */
const globalAny = global;

// Validate and set each component
const setGlobalWebRTC = (name, component) => {
  if (component && typeof component === 'function') {
    globalAny[name] = globalAny[name] || component;
    if (typeof window !== 'undefined') {
      window[name] = window[name] || component;
    }
    console.log(`[WebRTC Polyfill] ✅ ${name} set globally`);
  } else {
    console.error(
      `[WebRTC Polyfill] ❌ ${name} not available or invalid:`,
      typeof component
    );
  }
};

// Set WebRTC components globally
setGlobalWebRTC('RTCPeerConnection', webrtcComponents.RTCPeerConnection);
setGlobalWebRTC('RTCIceCandidate', webrtcComponents.RTCIceCandidate);
setGlobalWebRTC(
  'RTCSessionDescription',
  webrtcComponents.RTCSessionDescription
);
setGlobalWebRTC('MediaStream', webrtcComponents.MediaStream);
setGlobalWebRTC('MediaStreamTrack', webrtcComponents.MediaStreamTrack);
setGlobalWebRTC('RTCRtpSender', webrtcComponents.RTCRtpSender);
setGlobalWebRTC('RTCRtpTransceiver', webrtcComponents.RTCRtpTransceiver);

// Handle MediaStreamTrackEvent separately (might not be available in some versions)
if (webrtcComponents.MediaStreamTrackEvent) {
  setGlobalWebRTC(
    'MediaStreamTrackEvent',
    webrtcComponents.MediaStreamTrackEvent
  );
} else {
  // Create a minimal polyfill for MediaStreamTrackEvent compatible with Hermes
  const MediaStreamTrackEventPolyfill = function MediaStreamTrackEvent(
    type,
    eventInitDict = {}
  ) {
    // Create a plain object instead of extending Event (which may not exist in Hermes)
    const event = {
      type: type,
      track: eventInitDict.track || null,
      target: eventInitDict.target || null,
      currentTarget: eventInitDict.currentTarget || null,
      bubbles: eventInitDict.bubbles || false,
      cancelable: eventInitDict.cancelable || false,
      defaultPrevented: false,
      preventDefault: function () {
        this.defaultPrevented = true;
      },
      stopPropagation: function () {},
      stopImmediatePropagation: function () {},
    };

    return event;
  };

  // Add prototype if needed
  MediaStreamTrackEventPolyfill.prototype = {};

  setGlobalWebRTC('MediaStreamTrackEvent', MediaStreamTrackEventPolyfill);
  console.log(
    '[WebRTC Polyfill] ⚠️ Using MediaStreamTrackEvent polyfill for Hermes'
  );
}

// Set navigator
globalAny.navigator = globalAny.navigator || {};
if (webrtcComponents.mediaDevices) {
  globalAny.navigator.mediaDevices =
    globalAny.navigator.mediaDevices || webrtcComponents.mediaDevices;
  globalAny.navigator.getUserMedia =
    globalAny.navigator.getUserMedia ||
    webrtcComponents.mediaDevices.getUserMedia;
}

if (typeof window !== 'undefined') {
  window.navigator = window.navigator || {};
  if (webrtcComponents.mediaDevices) {
    window.navigator.mediaDevices =
      window.navigator.mediaDevices || webrtcComponents.mediaDevices;
    window.navigator.getUserMedia =
      window.navigator.getUserMedia ||
      webrtcComponents.mediaDevices.getUserMedia;
  }
}

// Validate final setup
const requiredGlobals = [
  'RTCPeerConnection',
  'RTCIceCandidate',
  'RTCSessionDescription',
];
const missingGlobals = requiredGlobals.filter((name) => !globalAny[name]);

if (missingGlobals.length > 0) {
  console.error(
    '[WebRTC Polyfill] ❌ Missing required globals:',
    missingGlobals
  );
} else {
  console.log('[WebRTC Polyfill] ✅ All required WebRTC globals are available');
}

/* 🛡 Safe patch — tránh crash */
const origAddTrack = RTCPeerConnection.prototype.addTrack;
RTCPeerConnection.prototype.addTrack = function (track, ...args) {
  if (!track) {
    console.warn('[WebRTC] addTrack skipped because track=null');
    return null;
  }
  return origAddTrack.apply(this, [track, ...args]);
};

const origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
RTCRtpSender.prototype.replaceTrack = function (track) {
  if (!track) {
    console.warn('[WebRTC] replaceTrack skipped because track=null');
    return Promise.resolve();
  }
  return origReplaceTrack.apply(this, [track]);
};
