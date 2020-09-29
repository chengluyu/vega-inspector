const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const RemarkHTML = require("remark-html");

const basePath = path.resolve(__dirname, "..");

module.exports = {
  entry: path.join(basePath, "src", "index.tsx"),
  output: {
    filename: "[name].bundle.js",
    path: path.join(basePath, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.pcss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("tailwindcss"), require("autoprefixer")],
              },
            },
          },
        ],
      },
      { test: /\.(?:gif|jpg|png|svg|webp)$/, use: ["file-loader"] },
      { test: /\.(?:eot|otf|ttf|woff|woff2)$/, use: ["file-loader"] },
      {
        test: /\.md$/,
        use: [
          "raw-loader",
          {
            loader: "remark-loader",
            options: { remarkOptions: { plugins: [RemarkHTML] } },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(basePath, "src", "index.html"),
    }),
    new MonacoWebpackPlugin(),
    new ManifestPlugin(),
    new FaviconsWebpackPlugin(
      path.join(basePath, "src", "images", "favicon.png")
    ),
  ],
  optimization: {
    minimize: false,
  },
};
