const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * Adds the monorepo root as a watch folder so Metro can resolve
 * the local library source directly (no symlinks needed).
 */
const config = {
  watchFolders: [root],
  resolver: {
    // Map the package name to the local src/ directory
    extraNodeModules: {
      '@think-grid-labs/react-native-starter-auth': path.resolve(root, 'src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
