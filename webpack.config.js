const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    index: "./src/client.ts",
    watch: "./src/watch.ts",
    search: "./src/search.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
    library: "MyLibrary",
    libraryTarget: "var",
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {},
    alias: {
      process: "process/browser",
    },
  },
  externals: {
    express: "express",
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ContextReplacementPlugin(
      /express\/lib/,
      path.resolve(__dirname, "node_modules")
    ),
    new Dotenv({ systemvars: true }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    // ...existing code...
  },
};
