const util = require('./utils/util.js')
App({
  globalData: {
    userInfo: null,
    apiUrl: 'https://activity.yypiano.cn',
    app_type: util.app_type,
    shareUrl: `/pages/index/index?isShare=true`,
    shareTitle: '消保知识竞答，大奖等你来拿',
    shareImg: '/utils/images/share.png'
  }
})