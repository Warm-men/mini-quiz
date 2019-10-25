const wxRequest = require('../../utils/request.js')
const address = require('../../utils/address.js')
const util = require('../../utils/util.js')
const inspect = require('../../utils/userInfo_inspect.js')
const app = getApp()
Page({
  data: {
    loadingTime: 2000,
    array: [],
    selectArr: {},
    multiArray: address.multiArray,
    multiIndex: address.multiIndex,
    isShowAddress: false,
    present_img1: null,
    img1_class: null,
    present_img2: null,
    img2_class: null,
    isShowResult: false,
    isShowGotoIndex: false,
    pickerTitleStyle: 'picker-title',
    loading: false,
    maxTextLenId: 18,
    maxTextLenPhoto: 11
  },
  onLoad(){
    const lottery_record_id =  wx.getStorageSync('lottery_record_id')
    if (lottery_record_id) {
      this.handleGetLotteryRecordId(lottery_record_id)
      return null
    }
    const record_id  = wx.getStorageSync('record_id')
    wxRequest({
      url: 'api/Question/lottery',
      data: {
        record_id: record_id
      },
      success: (res) => {
        const { prize_key, lottery_record_id } = res.data.data
        wx.removeStorageSync('record_id')
        wx.removeStorageSync('total_score')
        setTimeout(() => {
          if (prize_key === 'prize_no' || res.data.code === 1014) {
            // NOTE:未中奖
            this.setData({
              present_img1: './images/thanks.png',
              img1_class: 'thank-img',
              isShowResult: true,
              isShowGotoIndex: true
            })
          } else {
            wx.setStorageSync('lottery_record_id', lottery_record_id)
            const isNeedInfo = prize_key === 'huawei_mate' || prize_key === 'laxiang'
            this.setData({
              isShowAddress: isNeedInfo,
              img1_class: prize_key,
              img2_class: prize_key + '_title',
              lottery_record_id: lottery_record_id,
              present_img1: util.prize_data[prize_key][0],
              present_img2: util.prize_data[prize_key][1],
              isShowResult: true
            })
          }
        }, this.data.loadingTime)
      }
    })
  },
  handleGetLotteryRecordId(lottery_record_id){
    wxRequest({
      url: 'api/Question/getWinRecord',
      data: {
        app_type: app.globalData.app_type
      },
      success: (res) => {
        const { code, data } = res.data
        if (code === 1 && data) {
          const { prize_key } = data
          const isNeedInfo = prize_key === 'huawei_mate' || prize_key === 'laxiang'
            this.setData({
              isShowAddress: isNeedInfo,
              img1_class: prize_key,
              img2_class: prize_key + '_title',
              lottery_record_id: lottery_record_id,
              present_img1: util.prize_data[prize_key][0],
              present_img2: util.prize_data[prize_key][1],
              isShowResult: true
            })
        } else {
          wx.removeStorageSync('lottery_record_id')
          this.gotoIndex()
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
      address: multiArray[0][value[0]] + multiArray[1][value[1]],
      pickerTitleStyle: 'picker-title-has-picked'
    })
  },
  bindMultiPickerColumnChange (e) {	
    var data = {	
      multiArray: this.data.multiArray,	
      multiIndex: this.data.multiIndex	
    };	
    data.multiIndex[e.detail.column] = e.detail.value;	
    switch (e.detail.column) {	
      case 0:	
        let index = data.multiIndex[0]	
        data.multiArray[1] = address.handleColumnchange(index)	
        data.multiIndex[1] = 0;	
        data.multiIndex[2] = 0;	
        break;	
    }	
    this.setData(data);	
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
  gotoIndex(){
    wx.navigateBack({
      delta: 1
    })
  },
  postAddress(){
    const {userName, idCard, tel, address, lottery_record_id, isShowAddress, loading } = this.data
    if (loading) {
      return null
    }
    // NOTE:一、二等奖
    if (isShowAddress) {
      if ((!userName || !idCard || !address || !tel)) {
        wx.showToast({
          title: '请填完信息',
          icon: 'none',
          duration: 1000
        })
        return null
      }
      if (!inspect.isValidCustomerName(userName)) {
        wx.showToast({
          title: '请输入正确的姓名',
          icon: 'none',
          duration: 1000
        })
        return null
      }
      if (!inspect.isValidCustomerID(idCard)) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1000
        })
        return null
      }
      if (!inspect.isValidCustomerTelephone(tel)) {
        wx.showToast({
          title: '请输入正确的手机码',
          icon: 'none',
          duration: 1000
        })
        return null
      }
    }
    if (!tel) {
      wx.showToast({
        title: '请填完信息',
        icon: 'none',
        duration: 1000
      })
      return null
    }
    if (!inspect.isValidCustomerTelephone(tel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return null
    }
    this.data.loading = true
    const data = {
      userName,
      idCard,
      tel,
      address
    }
    wxRequest({
      url: 'api/Question/subWinUserParams',
      data: {
        lottery_record_id: lottery_record_id,
        user_params: data
      },
      success: (res) => {
        // NOTE:信息提交成功
        if (res.data.code === 1) {
          this.data.loading = false
          wx.removeStorageSync('lottery_record_id')
          wx.redirectTo({
              url: '../prize/prize'
          })
        } else {
          this.data.loading = false
        }
      }
    })
  }
})
