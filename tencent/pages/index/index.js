//index.js
//获取应用实例
const app = getApp()
const wxLogin = require('../../utils/login.js')
const wxRequest = require('../../utils/request.js')

Page({
  data: {
    winningCode: null,
    isPushLettoryLoading: false,
    isGotoResultLoading: false
  },
  onShow(){
    wxRequest({
      url: 'api/Question/getWinRecord',
      data: {
        app_type: app.globalData.app_type
      },
      success: (res) => {
        let { data } = res.data        
        this.setData({
          winningCode: !!data && data.winning_code
        })
        wx.setStorageSync('winningCode', data.winning_code)
      }
    })
  },
  enterLottery(e){
    if(this.data.isPushLettoryLoading){
      return null 
    }
    this.data.isPushLettoryLoading = true
    const refreshToken  = wx.getStorageSync('refresh_token')
    if (refreshToken) {
      wx.navigateTo({
        url: '../lottery/lottery'
      })
    } else {
      wxLogin(() => {
        wx.navigateTo({
          url: '../lottery/lottery'
        })
      })
    }
  },
  gotoResult(e){
    if(this.data.isGotoResultLoading){
      return null 
    }
    this.data.isGotoResultLoading = true
    const refreshToken  = wx.getStorageSync('refresh_token')
    if (refreshToken) {
      
      wx.navigateTo({
        url: '../result/result'
      })
    } else {
      wxLogin(() => {
        wx.navigateTo({
          url: '../result/result'
        })
      })
    }
  },
  onShareAppMessage(options) {
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.shareUrl,
      imageUrl: app.globalData.shareImg
    }
  }
})
