const app = getApp()
Page({
  data: {
    result: [],
    totalScore: null,
    totalScoreText: null,
    dollImageUrl: null,
    firstWin: null
  },
  onLoad(){
    const total_score  = wx.getStorageSync('total_score')
    const first_win  = wx.getStorageSync('first_win')
    this.checkScoreLevel(total_score)
    this.setData({
      firstWin: first_win
    })
  },
  onShareAppMessage() {
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.shareUrl,
      imageUrl: app.globalData.shareImg
    }
  },
  backHome(e){
    wx.navigateBack({
      delta: 1
    })
  },
  goDrawing(e){
    wx.redirectTo({
      url: '../present/present'
    })
  },
  checkScoreLevel(total_score){
    let totalScoreText = null
    let dollImageUrl = null
    if(total_score >= 30){
      totalScoreText =  '消保达人'
      dollImageUrl = './images/doll_great.png'
    }else{
      totalScoreText =  '消保小白'
      dollImageUrl = './images/doll_trying.png'
    }
    this.setData({totalScore: total_score, totalScoreText, dollImageUrl})
  }
  
})
