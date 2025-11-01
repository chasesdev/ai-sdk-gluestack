module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      // Reanimated plugin must be listed last
      "react-native-reanimated/plugin",
    ],
  };
};
