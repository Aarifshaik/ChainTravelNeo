// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// // eslint-disable-next-line no-undef
// const config = getDefaultConfig(__dirname);

// module.exports = config;







const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url === '/') {
        req.url = '/index.bundle?platform=android'; // Redirect root to bundle
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
