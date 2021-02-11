const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { merge } = require("webpack-merge");

const base = {
  entry: {
    index: "index.ts",
    login: "login.ts",
  },
  context: path.resolve(__dirname, "src"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: "ts-loader",
            options: { onlyCompileBundledFiles: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: "body",
      scriptLoading: "defer",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "login.html",
      inject: "body",
      scriptLoading: "defer",
      chunks: ["login"],
    }),
  ],
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".ts", ".js"],
  },
};

const dev = {
  mode: "development",
  stats: {
    colors: true,
  },
  devServer: {
    https: true,
    contentBase: "./dist",
    clientLogLevel: "info",
    port: 3000,
    inline: true,
    historyApiFallback: false,
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
  },
  devtool: "inline-source-map",
};

module.exports = () => merge(base, dev);
