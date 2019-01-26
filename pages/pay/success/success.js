//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  //事件处理函数
  goMyOrder: function() {
    wx.reLaunch({
      url: '/pages/user/user'
    })
  },
  onLoad: function () {
    
  }
})
