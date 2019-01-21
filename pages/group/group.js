//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading:false,
    groupOrderId:null,

    //课程
    courseValue: '',
    courseItems:[
      { 'name':'零基础学童英语课程',id:123123},
      { 'name': '高阶版对接入学英语课程', id: 123123 },
    ],

    //组团人数
    people: [2,3,4,5],
    peopleIndex: 0,

  },
  //选择课程
  courseChange(e){
    this.setData({
      courseValue: e.detail.value
    });
  },
  //查看课程详情
  courseDetail(e){
    console.log(e.target.dataset.id);
  },
  //选择组团人数
  bindPeopleChange(e){
    this.setData({
      peopleIndex: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  //创建团
  createGroup(){
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/group', // 仅为示例，并非真实的接口地址
      data: {
        "courseId": 123123,
        "groupNumberNeed": 4
      },
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code==1) {
          self.setData({
            groupOrderId: res.data.groupOrderId
          });
          self.addGroup();
        }
      }
    })
  },
  //加入团
  addGroup(){
    var self = this;
    var putData = {
      "groupOrderId": this.data.groupOrderId,
      "openId": app.globalData.openId,
      "courseId": 123123,  //课程ID
      "originator": false,  //是否发起人
      "amount": 10.25,  //价格
      "groupNumberNeed": 4,  //成团人数
    };
    this.setData({
      loading: true
    });

    console.log(putData);

    wx.request({
      url: 'https://www.svenglish.cn/api/order/course', // 仅为示例，并非真实的接口地址
      data: putData,
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.succeed) {
          wx.showModal({
            title: '提示',
            content: '提交成功！我们会尽快与您取得联系！',
            success: function (res) {
              wx.reLaunch({
                url: '/pages/class/class'
              })
            }
          });

        }

        //关闭loading
        self.setData({
          loading: false
        });
      },
      fail(res) {
        //关闭loading
        self.setData({
          loading: false
        });
      }
    })
  },
  bindPintuan:function(){

    if (this.data.groupOrderId){
      this.addGroup();
    }else{
      this.createGroup();
    }
    
    
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
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
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
