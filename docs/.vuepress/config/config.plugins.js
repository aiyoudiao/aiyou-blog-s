module.exports = [
  [
    'thirdparty-search',
    {
      // 可选，默认 []
      // 第三方搜索
      thirdparty: [
        {
          title: '在MDN中搜索', // 在搜索结果显示的文字
          frontUrl: 'https://developer.mozilla.org/zh-CN/search?q=', // 搜索链接的前面部分
          behindUrl: '', // 搜索链接的后面部分，可选，默认 ''
        },
        {
          title: '在Runoob中搜索',
          frontUrl: 'https://www.runoob.com/?s=',
        },
        {
          title: '在Vue API中搜索',
          frontUrl: 'https://cn.vuejs.org/v2/api/#',
        },
        {
          title: '通过百度搜索本站的',
          frontUrl: 'https://www.baidu.com/s?wd=site%3Axugaoyi.com%20',
        },
      ],
    },
  ],
  [
    // 一键拷贝
    'one-click-copy',
    {
      // 代码块复制按钮
      copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
      copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
      duration: 1000, // prompt message display time.
      showInMobile: false, // whether to display on the mobile side, default: false.
    },
  ],
  [
    'vuepress-plugin-comment',
    {
      choosen: 'gitalk',
      options: {
        clientID: '171e5c5b54d77ae16f2a',
        clientSecret: '968f87ef701bd557afc7526eb1b12f8428484f61',
        repo: 'aiyoudiao.github.io',
        owner: 'aiyoudiao',
        admin: ['aiyoudiao'],
        distractionFreeMode: false, // 是否开启自由模式
        pagerDirection: 'last', // 'first'正序 | 'last'倒序
        labels: ['Gitalk', 'Comment'], // GitHub issue 的标签
      },
      // choosen: 'valine',
      // // options选项中的所有参数，会传给Valine的配置
      // options: {
      //   el: '#valine-vuepress-comment',
      //   appId: 'g8HOBs1WpQJbKD2IKAxm9SmC-gzGzoHsz',
      //   appKey: '5p99J0UJimyrII9Q6Vf8PtOn',
      //   path: '<%- frontmatter.commentid || frontmatter.permalink %>',
      //   visitor: true,
      // },
    },
  ],
  [
    // 本地插件 aplayer
    (pluginOptions, context) => ({
      name: 'vuepress-plugin-aplayer',
      globalUIComponents: ['DynamicImportAPlayer'],
    }),
  ],
  [
    // 本地插件 live2d
    (pluginOptions, context) => ({
      name: 'vuepress-plugin-live2d',
      globalUIComponents: ['VuepressPluginLive2d'],
    }),
  ],
  'tabs'
]
