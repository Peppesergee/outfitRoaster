const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Transform all node_modules through Babel so that Hermes never sees
// untranspiled private class fields (#field syntax) from any dependency.
config.transformer.transformIgnorePatterns = [];

module.exports = config;
