
module.exports = {
  publicPath: process.env.PUBLIC_PATH,
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: true
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  configureWebpack: {
    devtool: 'source-map'
  }
}
