const util = require('./utils/util.js')
App({
  globalData: {
    userInfo: null,
    apiUrl: 'https://activity.yypiano.cn',
    app_type: util.app_type,
    shareUrl: `/pages/index/index`,
    shareTitle: '答题游戏',
    shareImg: 'https://static.letote.cn/logo/mini_app.png'
  }
})