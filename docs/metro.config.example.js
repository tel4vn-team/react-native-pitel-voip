/**
 * Metro configuration for WebRTC with New Architecture
 * Add this to your metro.config.js in the main app
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      // Add WebRTC specific resolving
      alias: {
        'react-native-webrtc': 'react-native-webrtc',
      },
      // Ensure WebRTC modules are properly resolved
      platforms: ['ios', 'android', 'native', 'web'],
    },
    transformer: {
      ...defaultConfig.transformer,
      // Enable experimental import support for WebRTC
      experimentalImportSupport: true,
      // Ensure proper handling of WebRTC modules
      unstable_allowRequireContext: true,
    },
    serializer: {
      ...defaultConfig.serializer,
      // Ensure WebRTC modules are included in bundle
      getModulesRunBeforeMainModule: () => [
        require.resolve('react-native-webrtc/lib/webrtc-polyfill.js'),
      ],
    },
  };
})();
