const wxLogin = require('./login.js')

const wxRequest = (formData) => {
  let {
    url,
    data,
    success,
    error
  } = formData
  url = `https://activity.yypiano.cn/${url}`
  wx.request({
    url,
    data: {
      token: wx.getStorageSync('token'),
      params: data
    },
    header:{ 'content-type': 'application/json' },
    success: (successRes) => {
      const { code, msg } = successRes.data
      // NOTE：code为1005时token过期，需要重新登录
      if (code === 1005) {
        wx.removeStorageSync('refresh_token')
        wxLogin(() => {
          wxRequest(formData)
        })
        error && error(successRes)
        return null
      }
      if (code !== 1) {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 1000
        })
        error && error(err)
        return null
      }
      success && success(successRes)
    },
    error: (err) => {
      error && error(err)
    }
  })
}

module.exports = wxRequest