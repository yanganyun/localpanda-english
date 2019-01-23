//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    courses:[],

    banner:{
      imgUrls: [
        'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/18349/10/4977/86937/5c370dafE88b3f32e/eb2693edb3708a5c.jpg!cr_1125x549_0_72!q70.jpg.dpg',
        'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/30282/11/118/153573/5c380bd3Ecf292c79/b81b79ab375d2081.jpg!cr_1125x549_0_72!q70.jpg.dpg',
        'https://m.360buyimg.com/mobilecms/s750x366_jfs/t1/7259/10/12551/189257/5c3703e9E29411761/6e4636eb1cdc5e06.jpg!cr_1125x549_0_72!q70.jpg.dpg'
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 4000,
      duration: 400,
      imgheight: '',
    }
  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    this.setData({
      'banner.imgheight': imgheight
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  //获取列表
  getCourses(){
    var self=this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/courses', // 仅为示例，并非真实的接口地址
      data: {
        groupOrderId: '148228562'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code==1){
          self.setData({
            courses: res.data.data
          })
        }
      },
      fail(res) {
        
      }
    })
  },
  onLoad: function () {

    this.getCourses();
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    //获取用户信息
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  onShareAppMessage: function () {
    return {
      title: '乐盼达英语',
      path: 'pages/index/index'
    }
  },
  startGroup() {
    wx.navigateTo({
      url: '/pages/group/group',
    })
  },
  addGroup(e) {
    var dataset = e.currentTarget.dataset;
    //判断是否已经拼团
    if (app.globalData.openId == this.data.courses[dataset.index].openId){
      wx.showModal({
        content: '您已经参加过了，请查看我的拼团！',
        showCancel: false
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/group/group?groupOrderId=' + dataset.id,
    })
  }
})
