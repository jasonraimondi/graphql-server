const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (on, config) => {
  config.env = config.env || {};
  config.env.MAILER_URL = process.env.MAILER_URL;
  on("file:preprocessor", cypressTypeScriptPreprocessor);
  return config;
};
