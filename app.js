//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.loginCode = res.code
        
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              
              var putData = {
                code: this.globalData.loginCode,
                encryptedData: res.encryptedData,
                iv: res.iv
              };

              wx.request({
                url: 'https://www.svenglish.cn/api/wechat/login', // 仅为示例，并非真实的接口地址
                data: putData,
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res => {
                  
                  if (res.data.code==1) {
                    this.globalData.openId = res.data.data.openId;
                  }

                }
              });
              

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})