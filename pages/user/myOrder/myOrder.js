
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: {},

    shareGroupOrderId: '',
    shareCourseId: '',
    courseTitle: '',
    orderList:[],
    courseItems: app.globalData.courseItems,
    isload:false
  },
  //事件处理函数
  onShareAppMessage(e) {
    var dataset = e.target.dataset;
    return {
      title: '当前分享的课程',
      desc: '课程介绍',
      path: '/pages/group/index?groupOrderId=' + dataset.sharegrouporderid // 路径，传递参数到指定页面。
    }
  },
  getName(id){
    var courseItems = this.data.courseItems;
    for (var i = 0; i < courseItems.length;i++){
      if (courseItems[i].id == id){
        return courseItems[i].name;
      }
    }
  },
  getMyOrder(openId){
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/my-orders?userId=' + openId, // 仅为示例，并非真实的接口地址
      method: 'GET',
      success: (res)=> {
        if (res.data.code == 1) {
          var courses = res.data.data;
          for (var i = 0; i < courses.length; i++) {
            var courseName = this.getName(courses[i].courseId);
            courses[i].courseName = courseName;
          }
          this.setData({
            orderList: courses
          });

          this.setData({
            isload: true
          });
          
        }
      }
    });
  },
  goDetail(e){
    
    wx.navigateTo({
      url: '/pages/group/index?groupOrderId=' + e.currentTarget.dataset.grouporderid
    })
  },
  
  onLoad(){



    if (app.globalData.userInfo) {
      this.getMyOrder(app.globalData.openId);
      this.setData({
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.getMyOrder(app.globalData.openId);
        this.setData({
          hasUserInfo: true
        });
      };
      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.getMyOrder(app.globalData.openId);
          this.setData({
            hasUserInfo: true
          });
        }
      })
    }
  },
  getUserInfo: function (e) {
    var self = this;

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });

    //获取用户信息
    app.getUserInfo(function(data){
      self.getMyOrder(data.openId);
    })

  }
})
