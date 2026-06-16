const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",

  entry: "./src/index.tsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  publicPath: "http://localhost:8082/"

  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/
      },

      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new TerserPlugin({
  extractComments: false,
  terserOptions: {
    format: {
      comments: /@license|@preserve|!/i,
    },
  },
})
  ],

  
  devServer: {
  port: 8082,
  hot: true,
  historyApiFallback: true,

  headers: {
    "Access-Control-Allow-Origin": "*"
  },

  client: {
    webSocketURL: {
      hostname: "localhost",
      port: 8082,
      protocol: "ws"
    }
  }
}
};
