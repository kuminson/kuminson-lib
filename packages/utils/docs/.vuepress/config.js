module.exports = {
  base: '/utils/',
  title: '@kuminson/utils',
  description: '私人常用方法库',
  port: '4002',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'guide', link: '/guide/' },
      { text: 'doc', link: '/doc/' },
      { text: 'changeLog', link: '/changelog/' }
    ],
    sidebar: {
      '/guide/': 'auto',
      '/doc/': [
        '',
        'function'
      ]
    },
    lastUpdated: 'Last Updated'
  }
}