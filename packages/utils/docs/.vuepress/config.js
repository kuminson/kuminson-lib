module.exports = {
  base: '/utils/',
  title: '@kuminson/utils',
  description: '私人常用方法库',
  port: '4001',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'guide', link: '/guide/' },
      { text: 'doc', link: '/doc/' }
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