const head = require('./config/config.head')
const nav = require('./config/config.nav')
const plugins = require('./config/config.plugins')
const theme = require('./config/config.theme')

module.exports = {
  title: 'aiyoudiao',
  description: '码二~',
  dest: './blog',
  head,
  plugins,
  theme: require.resolve('./theme'),
  // theme: 'vdoing',
  themeConfig: {
    nav,
    ...theme,
  },
}
