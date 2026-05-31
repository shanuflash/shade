module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 56) wires up expo-router and the
    // react-native-worklets/reanimated transform automatically.
    presets: ['babel-preset-expo'],
  };
};
