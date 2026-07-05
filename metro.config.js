const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure all expo and react-native packages get Babel-transformed,
// including those that use private class fields (#field syntax)
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!' +
    [
      'react-native',
      '@react-native',
      '@react-native-community',
      'expo',
      '@expo',
      'react-native-gesture-handler',
      'react-native-safe-area-context',
      'react-native-screens',
      'react-native-view-shot',
    ].join('|') +
    ')',
];

module.exports = config;
