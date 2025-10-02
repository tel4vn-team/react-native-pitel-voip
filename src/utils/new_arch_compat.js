/**
 * New Architecture Compatibility Layer
 * Handles differences between old and new React Native architecture
 */

import { Platform } from 'react-native';

// Check if we're running on new architecture (Fabric/TurboModules)
export const isNewArchitecture = () => {
  try {
    // Check for Fabric renderer
    const isFabric = global.nativeFabricUIManager != null;

    // Check for TurboModules
    const isTurboModules = global.__turboModuleProxy != null;

    return isFabric || isTurboModules;
  } catch (error) {
    return false;
  }
};

// WebRTC compatibility for new architecture
export const initWebRTCForNewArch = () => {
  if (isNewArchitecture()) {
    console.log(
      '[NewArch] Detected new architecture, applying WebRTC patches...'
    );

    // For new architecture, we need to ensure WebRTC is properly loaded
    // Sometimes WebRTC modules aren't automatically loaded in Fabric
    try {
      // Force require react-native-webrtc
      const webrtc = require('react-native-webrtc');

      // Set globals if they don't exist
      if (
        typeof global.RTCPeerConnection === 'undefined' &&
        webrtc.RTCPeerConnection
      ) {
        global.RTCPeerConnection = webrtc.RTCPeerConnection;
        console.log(
          '[NewArch] ✅ RTCPeerConnection set from react-native-webrtc'
        );
      }

      if (
        typeof global.RTCSessionDescription === 'undefined' &&
        webrtc.RTCSessionDescription
      ) {
        global.RTCSessionDescription = webrtc.RTCSessionDescription;
        console.log(
          '[NewArch] ✅ RTCSessionDescription set from react-native-webrtc'
        );
      }

      if (
        typeof global.RTCIceCandidate === 'undefined' &&
        webrtc.RTCIceCandidate
      ) {
        global.RTCIceCandidate = webrtc.RTCIceCandidate;
        console.log(
          '[NewArch] ✅ RTCIceCandidate set from react-native-webrtc'
        );
      }

      if (typeof global.MediaStream === 'undefined' && webrtc.MediaStream) {
        global.MediaStream = webrtc.MediaStream;
        console.log('[NewArch] ✅ MediaStream set from react-native-webrtc');
      }
    } catch (error) {
      console.error('[NewArch] Failed to load react-native-webrtc:', error);
    }

    // Additional polyfills for new architecture
    if (typeof global.RTCPeerConnection === 'undefined') {
      console.error(
        '[NewArch] ❌ RTCPeerConnection still not available after patches'
      );
      return false;
    }

    // Ensure MediaStream constructor is available
    if (
      typeof global.MediaStream !== 'undefined' &&
      global.MediaStream.prototype
    ) {
      // Patch MediaStream for new architecture compatibility
      const originalAddTrack = global.MediaStream.prototype.addTrack;
      if (originalAddTrack) {
        global.MediaStream.prototype.addTrack = function (track) {
          if (!track) {
            console.warn(
              '[NewArch] Skipping null track in MediaStream.addTrack'
            );
            return;
          }
          return originalAddTrack.call(this, track);
        };
      }
    }

    return true;
  }

  return false;
};

export const logArchitectureInfo = () => {
  const isNewArch = isNewArchitecture();
  console.log('[Architecture] Info:', {
    isNewArchitecture: isNewArch,
    platform: Platform.OS,
    hasFabric: global.nativeFabricUIManager != null,
    hasTurboModules: global.__turboModuleProxy != null,
    hasHermes: typeof HermesInternal === 'object' && HermesInternal !== null,
  });
};
