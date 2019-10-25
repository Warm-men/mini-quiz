const wxRequest = require('../../utils/request.js')
const address = require('../../utils/address.js')
const app = getApp()
Page({
  data: {
    array: [],
    selectArr: {},
    multiArray: address.multiArray,
    multiIndex: address.multiIndex,
  },
  onShow(){
    if (this.data.array.length === 0) {
      wxRequest({
        url: 'api/Question/getQuestion',
        data: {
          app_type: app.globalData.app_type
        },
        success: (res) => {
          let { data } = res.data
          data.map((v, k)=>{
            data[k].select_set = JSON.parse(v.select_set)
          })
          this.setData({
            array: data
          })
        }
      })
    }
  },
  onShareAppMessage(options) {
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.shareUrl,
      imageUrl: app.globalData.shareImg
    }
  },
  bindconfirmTel(e){
    const { value } = e.detail
    this.setData({
      tel: value
    })
  },
  bindconfirmIdCard(e){
    const { value } = e.detail
    this.setData({
      idCard: value
    })
  },
  bindconfirmUserName(e){
    const { value } = e.detail
    this.setData({
      userName: value
    })
  },
  bindMultiPickerChange(e){
    const { value } = e.detail
    const { multiArray } = this.data
    this.setData({
      address: multiArray[0][value[0]] + multiArray[1][value[1]] + multiArray[2][value[2]]
    })
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
    const { selectArr, array } = this.data
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
      return null
    }
    wxRequest({
      url: 'api/Question/subQuestion',
      data: {
        answer,
        app_type: app.globalData.app_type
      },
      success: (res) => {
        // NOTE：填写完题目
        const { total_score, record_id, winning_code } = res.data.data
        wx.setStorageSync('resultData', res.data)
        wx.setStorageSync('winningCode', winning_code)
        if (total_score >= this.data.limitScore) {
          // NOTE:分数大于要求分数
          wx.setStorageSync('record_id', record_id)
        }
        wx.redirectTo({
          url: `../result/result?data=${res.data.data}`
        })
      }
    })
  }
})
