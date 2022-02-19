/**
 * 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
 */
module.exports = [
  // favicons，资源放在public文件夹
  ['link', { rel: 'icon', href: '/img/blog.ico' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/688669.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/751262.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/843699.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/862789.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/917480.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/998208.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/999332.png', as: 'image' }],
  // ['link', { rel: 'preload', href: 'https://cdn.jsdelivr.net/gh/zhixiangyao/CDN/images/anime/fate/1049978.png', as: 'image' }],
  ['script', { src: 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js' }],
  [
    'meta',
    {
      name: 'keywords',
      content:
        '前端博客,个人技术博客,前端,前端开发,前端框架,web前端,前端面试题,技术文档,学习,面试,JavaScript,js,ES6,TypeScript,vue,python,css3,html5,Node,git,github,markdown',
    },
  ],
  // 移动浏览器主题颜色
  ['meta', { name: 'theme-color', content: '#11a8cd' }],
  // 移动端阻止页面缩放
  [
    'meta',
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
  ],
]
