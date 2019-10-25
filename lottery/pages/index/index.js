//index.js
//获取应用实例
const app = getApp()
const wxLogin = require('../../utils/login.js')
const wxRequest = require('../../utils/request.js')

Page({
  data: {
    prizeRecore: null,
    isGetRecord: false
  },
  onLoad(options){
    if (options && options.isShare &&  wx.getStorageSync('lottery_record_id')) {
      wxRequest({
        url: 'api/Question/getWinRecord',
        data: {
          app_type: app.globalData.app_type
        },
        success: (res) => {
          let { data, code } = res.data
          // NOTE：有中奖记录的去表单页面,没有的清除缓存防止测试等后台删除数据
          if (code === 1 && data) {
            wx.navigateTo({
              url: `../present/present`
            })
          } else {
            wx.removeStorageSync('lottery_record_id')
          }
        },
        error: () => {
          this.setData({
            isGetRecord: true
          })
        }
      })
    }
  },
  onShow(){
    wxRequest({
      url: 'api/Question/getWinRecord',
      data: {
        app_type: app.globalData.app_type
      },
      success: (res) => {
        let { data, code } = res.data
        if (code === 1 && data) {
          this.setData({
            prizeRecore: data,
            isGetRecord: true
          })
        } else {
          this.setData({
            isGetRecord: true
          })
        }
      },
      error: () => {
        this.setData({
          isGetRecord: true
        })
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
  getUserInfoSuccess: (e) => {
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
  gotoResult: (e) => {
    const refreshToken  = wx.getStorageSync('refresh_token')
    if (refreshToken) {
      wx.navigateTo({
        url: '../prize/prize'
      })
    } else {
      wxLogin(() => {
        wx.navigateTo({
          url: '../prize/prize'
        })
      })
    }
  }
})
