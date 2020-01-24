const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const WebpackTeamcityBundleSizePlugin = require("webpack-teamcity-bundle-size-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ChunkRenamePlugin = require("webpack-chunk-rename-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
const autoprefixer = require("autoprefixer");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const excludeFolders = /(node_modules|polyfills)/;
const excludeVendorFolders = /(node_modules(?!(\/|\\)@nudge)|polyfills)/;
const isDebug = process.env.NODE_ENV !== "production" ? true : false;
const isDevServer = process.argv.find(elem => elem.includes("webpack-dev-server")) != undefined;

/**
 * Configurations
 *
 */
const output = {
    path: path.join(__dirname, "../Nudge.ExternalApplications.Web/wwwroot/widgets/static"),
    publicPath: "/widgets/static/",
    pathinfo: false,
    chunkFilename: "./[name].[chunkhash].js",
};
// cheap-module-source-map used in create-react-app
const devtool = isDevServer ? "cheap-module-source-map" : "source-map";
const lintConfig = {
    loader: "eslint-loader",
    options: {
        cache: false,
        failOnError: false,
    },
};
const transpileConfig = {
    loader: "babel-loader",
    options: {
        cacheDirectory: true,
        cacheCompression: true,
        compact: true,
    },
};
const cssConfig = (sourceMap, importLoaders) => ({
    loader: "css-loader",
    options: {
        sourceMap,
        importLoaders,
    },
});
const postCssConfig = (sourceMap, modules) => ({
    loader: "postcss-loader",
    options: {
        plugins: function() {
            return [autoprefixer()];
        },
        sourceMap,
        modules,
    },
});

function modules() {
    const preprocess = isDebug ? `&DEBUG` : "";
    const extractLoader = isDevServer
        ? {
            loader: "style-loader",
            options: {
                sourceMap: true,
            },
        }
        : MiniCssExtractPlugin.loader;
    const rules = [
        {
            enforce: "pre",
            test: /\.(js|jsx)$/,
            exclude: excludeFolders,
            use: [lintConfig],
        },
        {
            test: /\.css$/,
            use: [
                extractLoader,
                cssConfig(true, false, 1),
                postCssConfig(true, true),
            ],
        },
        {
            test: /\.scss$/,
            use: [
                extractLoader,
                cssConfig(true, false, 2),
                postCssConfig(true, true),
                {
                    loader: "sass-loader",
                    options: {
                        modules: true,
                        outputStyle: "expanded",
                        sourceMap: true,
                        sourceMapContents: true,
                    },
                },
            ],
        },
        {
            test: /\.(js|jsx)$/,
            exclude: excludeVendorFolders,
            use: [transpileConfig, `preprocess-loader?+${preprocess}`],
        },
    ];
    const m_module = {
        strictExportPresence: true,
        rules,
    };
    return m_module;
}

function plugins() {
    let plugins = [];
    let provideValues = {};

    // Optimize/Minimize for production
    if (!isDebug) {
        provideValues = Object.assign({}, provideValues, {
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        });
    }

    plugins = plugins.concat([
        // Using a custom miniCSSExtractPlugin module so that we don't put a hash on app.css
        new MiniCssExtractPlugin({
            filename: "./[name].css",
            chunkFilename: "./[name].[contenthash].css",
            sourceMap: true,
            renamedChunks: {
                ["vendor~widget"]: "vendor~widget.css",
            },
        }),
        new webpack.ProvidePlugin(provideValues),
        // This is needed because we are using runtimeChunks, and app.js will use the chunkFilename option
        new ChunkRenamePlugin({
            initialChunksWithEntry: true,
            ["vendor~widget"]: "vendor~widget.js",
        }),
        new CaseSensitivePathsPlugin(),
    ]);

    if (argv.env && argv.env.mode === "analysis") {
        plugins.push(new WebpackTeamcityBundleSizePlugin());
    }

    return plugins;
}

const stats = {
    assets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    errors: true,
    errorDetails: false,
    hash: true,
    modules: false,
    timings: true,
    warnings: true,
};
const resolve = {
    alias: {
        "~": path.resolve(__dirname, "."),
    },
    symlinks: false,
};

const nudgeConfigPath = process.env.NUDGE_CONFIG_PATH || "/ProgramData/Nudge";
const certPath = path.resolve(nudgeConfigPath, "ssl");
const devServer = !isDevServer
    ? undefined
    : {
        port: 8083,
        publicPath: "/output/",
        hot: true,
        inline: true,
        compress: true,
        overlay: false,
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebook/create-react-app/issues/387.
            disableDotRule: true,
        },
        stats,
        https: {
            spdy: {
                protocols: ["http/1.1"],
            },
            key: fs.readFileSync(path.normalize(path.resolve(certPath, "wildcard.dev.nudge.ai.key"))),
            cert: fs.readFileSync(path.normalize(path.resolve(certPath, "wildcard.dev.nudge.ai.crt"))),
            ca: fs.readFileSync(path.normalize(path.resolve(certPath, "alphassl intermedidate.crt"))),
        },
    };

function optimization() {
    return {
        minimize: isDebug ? undefined : true,
        minimizer: isDevServer
            ? undefined
            : [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            // we want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minfication steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending futher investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                    // Use multi-process parallel running to improve the build speed
                    // Default number of concurrent runs: os.cpus().length - 1
                    parallel: true,
                    // Enable file caching
                    cache: true,
                    sourceMap: true,
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],

        // This is needed to keep hashes stable between builds if contents haven't changed
        runtimeChunk: true, // let webpack name the runtime chunk so that we get one for app and app-phone

        splitChunks: {
            cacheGroups: {
                // This splits out vendor chunks for all regular chunks
                vendor: {
                    test: /[\\/]node_modules[\\/](?!@nudge)/,
                    chunks: "all",
                    priority: -10,
                },
            },
        },
    };
}

const polyFillAlways = ["./polyfills/polyfillAlways.js", "abortcontroller-polyfill"];
const polyfillsExport = {
    entry: {
        "polyfill-babel": "babel-polyfill",
        "polyfill-fetch": "whatwg-fetch",
        "polyfill-always": polyFillAlways,
    },
    stats,
    output,
    devtool,
};
const widgetExport = {
    entry: {
        widget: ["./App/main.js"],
    },
    output,
    devtool,
    module: modules(),
    plugins: plugins(),
    stats,
    resolve,
    devServer,
    optimization: optimization(),
};

module.exports = isDevServer ? widgetExport : [polyfillsExport, widgetExport];
