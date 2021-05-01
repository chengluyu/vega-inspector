import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import RemarkHTML from "remark-html";
import * as webpack from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import * as paths from "./paths";

type WebpackPlugin =
  | ((this: webpack.Compiler, compiler: webpack.Compiler) => void)
  | webpack.WebpackPluginInstance;

const common: webpack.Configuration = {
  entry: paths.src("index.tsx"),
  output: {
    filename: "[name].bundle.js",
    path: paths.dist(),
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
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.src("index.html"),
    }),
    new MonacoWebpackPlugin(),
    new WebpackManifestPlugin() as WebpackPlugin,
    new FaviconsWebpackPlugin(paths.src("images", "favicon.png")),
  ],
  optimization: {
    minimize: false,
  },
};

export default common;
