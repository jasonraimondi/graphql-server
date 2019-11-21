const withCSS = require('@zeit/next-css');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { join } = require("path");

module.exports = withCSS({
    distDir: "dist",
    publicRuntimeConfig: {
        REFRESH_TOKEN: process.env.REFRESH_TOKEN || "http://localhost:4000/refresh_token",
        GRAPH_API_URL: process.env.GRAPH_API_URL || "http://localhost:4000/graphql",
    },
    serverRuntimeConfig: {
        SECRET: process.env.SECRET || "9c574818-6f78-47fe-a626-5947dbf1c8f6n",
    },
    webpack(config, options) {
        config.resolve.plugins = [
            ...(config.resolve.plugins ? config.resolve.plugins : []),
            new TsconfigPathsPlugin()
        ];
        return config
    },
});
