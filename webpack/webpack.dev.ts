import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
import { merge } from "webpack-merge";
import * as paths from "./paths";
import common from "./webpack.common";

export type DevelopmentConfiguration = webpack.Configuration & {
  devServer?: webpackDevServer.Configuration;
};

export default merge<DevelopmentConfiguration>(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: paths.dist(),
    hot: true,
    historyApiFallback: true,
  },
});
