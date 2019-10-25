const util = require('./util.js')
const wxLogin = reConnect => {
  const refreshToken  = wx.getStorageSync('refresh_token')
  // NOTE: 未登录过
  if (refreshToken) {
    const data = {
      params: {
        login_type: 2,
        refresh_token: refreshToken,
        app_type: util.app_type
      }
    }
    wx.request({
      url: 'https://activity.yypiano.cn/api/Account/login',
      data,
      header:{ 'content-type': 'application/json' },
      success: (loginRes) => {
        const { code } = loginRes.data
      // NOTE：code为1008时refresh_token登录过期，需要走微信登录
        if (code === 1008) {
          wx.removeStorageSync('refresh_token')
          wxLogin(reConnect)
          return null
        }
        reConnect && reConnect()
      }
    })
    return null
  }
  wx.login({
    success(loginRes) {
      if (loginRes.code) {
        const code = loginRes.code
        wx.getUserInfo({
          success(infoRes) {
            const {  iv, encryptedData } = infoRes
            wx.request({
              url: 'https://activity.yypiano.cn/api/Account/wechatLogin',
              data: { code, encryptedData, iv, app_type: util.app_type },
              header:{ 'content-type': 'application/json' },
              success: (wechatLoginRes) => {
                const { openId, nickName, avatarUrl } = wechatLoginRes.data.data
                const data = {
                  params: {
                    open_id: openId,
                    user_name: nickName,
                    head_img: avatarUrl,
                    login_type: 1,
                    app_type: util.app_type
                  }
                }
                wx.request({
                  url: 'https://activity.yypiano.cn/api/Account/login',
                  data,
                  header:{ 'content-type': 'application/json' },
                  success: (loginRes) => {
                    const { refresh_token, token } = loginRes.data.data
                    wx.setStorageSync('refresh_token', refresh_token)
                    wx.setStorageSync('token', token)
                    reConnect && reConnect()
                  }
                })
              }
            })
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

module.exports = wxLogin