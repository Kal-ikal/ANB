module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel" // <-- SALAH! Plugin nyasar di dalam array preset
    ],
  };
}