//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    loading: false,
    formData: {
      name: '',
      email: '',
      message: ''
    }
  },
  bindName(e) {
    this.setData({
      'formData.name': e.detail.value
    })
  },
  bindEmail(e) {
    this.setData({
      'formData.email': e.detail.value
    })
  },
  bindMessage(e) {
    this.setData({
      'formData.message': e.detail.value
    })
  },
  submitFn(){
    
    var self = this;
    var putData = {
      objectType: "GENERAL",
      userName: this.data.formData.name,
      emailAddress: this.data.formData.email,
      message: this.data.formData.message,
      deviceType: 'MOBILE',
      "utcOffset": new Date().getTimezoneOffset() / 60 * -1
    };
    this.setData({
      loading:true
    });
    wx.request({
      url: 'https://www.svenglish.cn/api/user/feedback', // 仅为示例，并非真实的接口地址
      data: putData,
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.succeed){
          wx.showModal({
            title: '提示',
            content: '提交成功！我们会尽快与您取得联系！',
            success: function (res) {
              wx.reLaunch({
                url: '/pages/about/about'
              })
            }
          });
          
        }

        //关闭loading
        self.setData({
          loading: false
        });
      },
      fail(res){
        //关闭loading
        self.setData({
          loading: false
        });
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    console.log(e.groupOrderId);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
