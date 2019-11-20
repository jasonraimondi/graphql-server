const { join } = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

console.log(join(__dirname, "src"));
console.log(join(__dirname, "generated"));

module.exports = {
    distDir: "dist",
    publicRuntimeConfig: {
    },
    webpack(config, options) {
        config.resolve.plugins = [
            ...(config.resolve.plugins ? config.resolve.plugins : []),
            new TsconfigPathsPlugin()
        ];
        return config
    },
};
