const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Production optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: {
      keep_classnames: false,
      keep_fnames: false,
    },
    compress: {
      drop_console: process.env.NODE_ENV === 'production',
      drop_debugger: true,
      passes: 3,
    },
  },
}

module.exports = config
