module.exports = {
    // // enables scoped css
    // // https://github.com/zeit/next-plugins/tree/master/packages/next-css#with-css-modules-and-options
    // cssModules: true,
    // cssLoaderOptions: {
    //     importLoaders: 1,
    //     localIdentName: "[local]___[hash:base64:5]",
    // },
    publicRuntimeConfig: {
        API_URL: process.env.API_URL,
        S3_HOST: process.env.S3_HOST,
        S3_BUCKET: process.env.S3_BUCKET,
    },
    webpack(config, options) {
        // Further custom configuration here
        config.resolve.alias = {
            ...(config.resolve.alias ? config.resolve.alias : {}),
            '@': __dirname,
        };
        return config
    },
};