
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    groupOrderId: '',
    courseId: '',
    courseTitle: ''
  },
  //事件处理函数
  bindShare: function() {
    console.log(1222)
    wx.updateShareMenu({
      withShareTicket: true,
      success() { 
        console.log('分享成功')
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '当前分享的课程',
      desc: '课程介绍',
      path: '/pages/about/about' // 路径，传递参数到指定页面。
    }
  },
  onLoad(){
    
  }
})
