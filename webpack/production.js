const { merge } = require("webpack-merge");

module.exports = merge(require("./common"), {
  mode: "production",
  devtool: "source-map",
});
