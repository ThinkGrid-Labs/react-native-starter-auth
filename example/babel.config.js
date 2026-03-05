module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // Resolve the local package from the monorepo root
        '@think-grid-labs/react-native-starter-auth': '../src',
      },
    }],
    'react-native-reanimated/plugin',
  ],
};
