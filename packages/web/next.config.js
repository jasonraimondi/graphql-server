const withCSS = require("@zeit/next-css");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { join } = require("path");

module.exports = withCSS({
  minify: false,
  distDir: "dist",
  publicRuntimeConfig: {
    // API_URL: process.env.API_URL || "http://localhost:4000/auth/refresh_token",
    API_URL: process.env.API_URL || "http://localhost:4000",
  },
  serverRuntimeConfig: {
    SECRET: process.env.SECRET || "9c574818-6f78-47fe-a626-5947dbf1c8f6n",
  },
  webpack(config, options) {
    config.resolve.plugins = [...(config.resolve.plugins ? config.resolve.plugins : []), new TsconfigPathsPlugin()];
    return config;
  },
});
