const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_OPTIONS_API__: JSON.stringify(true)
            })
        ]
    }
});
