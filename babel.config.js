module.exports = {
  // 바벨은 파싱만 하고, 변환은 플러그인이 한다. 플러그인을 모아놓은 것이 preset이다
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79", // 크롬 79까지 지원하는
          ie: "11",
        },
        useBuiltIns: "usage",
        corejs: {
          // 바벨이 변환하지 못하는 코드는 폴리필이 변환한다 (예,Promise)
          version: 2,
        },
      },
    ],
  ],
};
