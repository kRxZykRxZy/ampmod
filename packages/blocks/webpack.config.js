// patch 'fs' to fix EMFILE errors, for example on WSL
const realFs = require("fs");
const gracefulFs = require("graceful-fs");
const webpack = require("webpack");
gracefulFs.gracefulify(realFs);

const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { EsbuildPlugin } = require("esbuild-loader");

module.exports = [
    {
        mode:
            process.env.NODE_ENV === "production"
                ? "production"
                : "development",
        entry: {
            vertical: "./shim/vertical.js",
        },
        output: {
            library: "ScratchBlocks",
            libraryTarget: "commonjs2", // still valid
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
        },
        optimization: {
            minimize: false,
        },
        performance: {
            hints: false,
        },
        plugins: [
            new webpack.BannerPlugin({
                banner: `
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License version 3 as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
        `.trim(),
            }),
        ],
    },
    {
        mode:
            process.env.NODE_ENV === "production"
                ? "production"
                : "development",
        entry: {
            vertical: "./shim/vertical.js",
        },
        output: {
            library: "Blockly",
            library: {
                type: "umd", // updated Webpack 5 syntax
            },
            path: path.resolve(__dirname, "dist", "web"),
            filename: "[name].js",
        },
        optimization: {
            minimizer: [new EsbuildPlugin({ target: "es2022" })],
        },
        plugins: [],
    },
    {
        mode:
            process.env.NODE_ENV === "production"
                ? "production"
                : "development",
        entry: "./shim/gh-pages.js",
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "gh-pages"),
        },
        optimization: {
            minimize: false,
        },
        performance: {
            hints: false,
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "blocks_vertical",
                        to: "playgrounds/blocks_vertical",
                    },
                    {
                        from: "core",
                        to: "playgrounds/core",
                    },
                    {
                        from: "media",
                        to: "playgrounds/media",
                    },
                    {
                        from: "msg",
                        to: "playgrounds/msg",
                    },
                    {
                        from: "tests",
                        to: "playgrounds/tests",
                    },
                    {
                        from: "*.js",
                        globOptions: {ignore: "webpack.config.js"},
                        to: "playgrounds",
                    },
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "../../node_modules/google-closure-library",
                        to: "closure-library",
                    },
                    { from: "blocks_common", to: "playgrounds/blocks_common" },
                    {
                        from: "blocks_vertical",
                        to: "playgrounds/blocks_vertical",
                    },
                    { from: "core", to: "playgrounds/core" },
                    { from: "media", to: "playgrounds/media" },
                    { from: "msg", to: "playgrounds/msg" },
                    { from: "tests", to: "playgrounds/tests" },
                    {
                        from: "*.js",
                        to: "playgrounds",
                        globOptions: { ignore: ["webpack.config.js"] },
                    },
                ],
            }),
        ],
    },
];
