const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
// const RemovePlugin = require("remove-files-webpack-plugin");

module.exports = {
  entry: "./videoCropper/src/app.js",
  output: {
    path: path.join(__dirname, "/videoCropper/static/"),
    filename: "js/app.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              insert: function insertBeforeAt(element) {
                const parent = document.querySelector("head");
                const target = document.querySelector("#customStyle");

                const lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, target);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png)$/i,
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]",
          publicPath: "/static/",
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "styles/[name].[ext]",
          publicPath: "/static/",
        },
      },
    ],
  },
  node: { fs: "empty" },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/[id].css",
    }),
    /* new RemovePlugin({
      before: {
        // parameters for "before compilation" stage.
        include: [path.join(__dirname, "/videoCropper/static/")],
      },
    }), */
  ],
  stats: {
    children: false,
    entrypoints: false,
    modules: false,
  },
};
