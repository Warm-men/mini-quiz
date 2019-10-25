const wxRequest = require('../../utils/request.js')
const address = require('../../utils/address.js')
const app = getApp()
Page({
  data: {
    array: [],
    selectArr: {},
    multiArray: address.multiArray,
    multiIndex: address.multiIndex,
    limitScore: 30,
    hideQuizPage: true,
    isShowDrawingPage: true,
    loading: false
  },
  onLoad(){
    wxRequest({
      url: 'api/Question/getQuestion',
      data: {
        app_type: app.globalData.app_type
      },
      success: (res) => {
        let { data, code } = res.data
        if (code === 1 && data) {
          data.map((v, k)=>{
            data[k].select_set = JSON.parse(v.select_set)
          })
          this.setData({
            array: data
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
  selectAnswer(value){
    const { dataset } = value.currentTarget
    const { id, select } = dataset
    const { selectArr } = this.data
    selectArr[id] = select
    this.setData({
      selectArr
    })
  },
  postAnswer(){
    const { selectArr, array, loading } = this.data
    if (loading) {
      return null
    }
    this.data.loading = true
    let answer = []
    for(let i in selectArr) {
      answer.push({
        id: i,
        choose_key: selectArr[i]
      })
    }
    if (answer.length < array.length) {
      wx.showToast({
        title: '请填完所有题目',
        icon: 'none',
        duration: 1000
      })
      this.data.loading = false
      return null
    }
    wxRequest({
      url: 'api/Question/subQuestion',
      data: {
        answer,
        app_type: app.globalData.app_type
      },
      success: (res) => {
        this.data.loading = false
        const { data, code } = res.data
        if (code === 1 && data) {
          const { total_score, record_id, first_win } = res.data.data
          wx.setStorageSync('total_score', total_score)
          wx.setStorageSync('first_win', first_win)
          if (total_score >= this.data.limitScore) {
            // NOTE:分数大于要求分数
            wx.setStorageSync('record_id', record_id)
          }
          wx.redirectTo({
            url: `../result/result`
          })
        }
      }
    })
  }
})
