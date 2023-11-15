const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script.js'
  },
  watch: true,
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        { from: 'assets', to: 'assets' }
      ]
    })
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    },
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  }
}
