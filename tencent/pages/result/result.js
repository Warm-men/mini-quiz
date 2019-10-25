const wxRequest = require('../../utils/request.js')
const app = getApp()
Page({
  data: {
    result: [],
    scoreLevel: null,
    totalScore: null,
    totalScoreText: null,
    dollImageUrl: null,
    isShocwPop: false,
    totalScoreTitle: null,
    winningCode: null
  },
  onLoad(option){
    const resultData  = wx.getStorageSync('resultData')
    const winningCode  = wx.getStorageSync('winningCode')
    console.log('winningCode========')
    console.log(winningCode)
    const { total_score, winning_code, question_list } = resultData.data
    this.checkScoreLevel(total_score)
    if(!!option && option.prePage === 'index'){
      this.setData({
        isShocwPop: true,
        winningCode,
        questionList: question_list
      })
    }else{
      this.setData({
        winningCode,
        questionList: question_list
      })
    }
  },
  checkScoreLevel(total_score){
    let totalScoreText = null
    let dollImageUrl = null
    let totalScoreTitle = null
    if(total_score >= 90){
      totalScoreText =  '我也想低调，可 是实力它不允许。'
      totalScoreTitle = '支付老司机'
      dollImageUrl = './images/doll3.png'
    }else if( total_score >= 60 ){
      totalScoreText =  '明人不说暗话，你 离老司机不远了。'
      totalScoreTitle = '继续加油！'
      dollImageUrl = './images/doll2.png'
    }else{
      totalScoreText =  '确认过眼神，你是个 需要多多努力的人。'
      totalScoreTitle = '支付小鲜肉'
      dollImageUrl = './images/doll1.png'
    }
    this.setData({totalScore: total_score, totalScoreText, dollImageUrl, totalScoreTitle})
    console.log(this.data);
    
  },
  onShareAppMessage(options) {
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.shareUrl,
      imageUrl: app.globalData.shareImg
    }
  },
  closePop(){
    this.setData({
      isShocwPop: false
    })
  },
  openPrizePop() {
    this.setData({
      isShocwPop: true
    })
  },
  backHome() {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})
