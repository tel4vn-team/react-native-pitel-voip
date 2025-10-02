/**
 * WebRTC Safe Polyfill & Patch for React Native
 * Version tested: react-native-webrtc@124.0.6
 * Prevents native crash: "[NSNull UTF8String]: unrecognized selector sent to instance"
 * ---------------------------------------------------------
 */

import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  MediaStreamTrackEvent,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCRtpSender,
} from 'react-native-webrtc';

/* 🌐 Polyfill: thêm WebRTC object vào window để tương thích với web code */
if (typeof window !== 'undefined') {
  window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
  window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
  window.RTCSessionDescription =
    window.RTCSessionDescription || RTCSessionDescription;
  window.MediaStream = window.MediaStream || MediaStream;
  window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
  window.MediaStreamTrackEvent =
    window.MediaStreamTrackEvent || MediaStreamTrackEvent;
  window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
  window.navigator.getUserMedia =
    window.navigator.getUserMedia || mediaDevices.getUserMedia;
}

/* 🧩 Patch 1: RTCPeerConnection.addTrack() */
if (typeof RTCPeerConnection !== 'undefined') {
  const origAddTrack = RTCPeerConnection.prototype.addTrack;
  RTCPeerConnection.prototype.addTrack = function (track, ...streams) {
    if (!track) {
      console.warn('[WebRTC] addTrack skipped (track = null)');
      return null;
    }

    // Lọc ra các stream hợp lệ
    const validStreams = (streams || []).filter(Boolean);

    // Bắt buộc stream.id phải là string (tránh [NSNull UTF8String])
    validStreams.forEach((s, i) => {
      if (!s.id || typeof s.id !== 'string') {
        s.id = `stream-${Date.now()}-${i}`;
      }
    });

    try {
      return origAddTrack.call(this, track, ...validStreams);
    } catch (err) {
      console.error('[WebRTC] addTrack error:', err);
      return null;
    }
  };
}

/* 🧩 Patch 2: RTCRtpSender.replaceTrack() */
if (typeof RTCRtpSender !== 'undefined') {
  const origReplaceTrack = RTCRtpSender.prototype.replaceTrack;
  RTCRtpSender.prototype.replaceTrack = function (track) {
    if (!this) {
      console.warn('[WebRTC] replaceTrack skipped (sender = null)');
      return Promise.resolve();
    }
    if (!track) {
      console.warn('[WebRTC] replaceTrack skipped (track = null)');
      return Promise.resolve();
    }
    try {
      return origReplaceTrack.call(this, track);
    } catch (err) {
      console.error('[WebRTC] replaceTrack error:', err);
      return Promise.resolve();
    }
  };

  /* 🧩 Patch 3: RTCRtpSender.getStats() */
  const origGetStats = RTCRtpSender.prototype.getStats;
  RTCRtpSender.prototype.getStats = function (...args) {
    if (!this) {
      console.warn('[WebRTC] getStats skipped (sender = null)');
      return Promise.resolve({});
    }
    try {
      return origGetStats.apply(this, args);
    } catch (err) {
      console.error('[WebRTC] getStats error:', err);
      return Promise.resolve({});
    }
  };
}

console.log('[WebRTC SafePatch] ✅ Applied successfully');
