const wxRequest = require('../../utils/request.js')
const app = getApp()
Page({
  data: {
    prizeData: null,
    outOfSz: false,
    tipsText: ''
  },
  onShow(){
    wxRequest({
      url: 'api/Question/getWinRecord',
      data: {
        app_type: app.globalData.app_type
      },
      success: (res) => {
        const { code, data } = res.data
        if (code === 1) {
          const userParams = JSON.parse(data.user_params)
          const prizeData = {
            ...data,
            ...userParams
          }
          const outOfSz = prizeData && prizeData.address && prizeData.address.indexOf('异地') > -1
          const addressText = outOfSz ? '无' : prizeData.address
          const inSZText = `我们会将奖品配送至您所选择的领奖网点：${addressText ? addressText : '无'}，领奖时间为本活动结束后，请关注本行微信公众号“深圳农村商业银行”后续推文，届时我行工作人员也会与您联系，请保持手机通畅。领奖时请提供本人身份证。如有疑问，请联系客服电话：961200（深圳）、4001961200（全国）。`     
          const outOfSzText = `您所选择的领奖网点为：异地（非深圳、临桂、柳江），活动结束后我行工作人员会与您联系询问配送地址，请保持手机畅通。如有疑问，请联系客服电话:4001961200(全国)。`
          const tipsText = outOfSz ? outOfSzText: inSZText
          this.setData({
            prizeData,
            outOfSz: !!outOfSz,
            tipsText
          })
        }
      }
    })
  },
  onShareAppMessage(options) {
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.shareUrl,
      imageUrl: app.globalData.shareImg
    }
  },
  backHome: (e) => {
    wx.navigateBack({
      delta: 1
    })
  }
})
