//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    openId: app.globalData.openId,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    courses:[],
    groupInfo:{
      groupMaxNumber: 1
    },
    groupEndTime: '',
    isEnd:false,
    countdown: 0,


    banner: {
      list: [
        { 'src': 'https://cloud.svenglish.cn/static/GroupPage/index_2.jpg', title: '面对面线下场景互动教学，高沉浸，高成效' },
        { 'src': 'https://cloud.svenglish.cn/static/GroupPage/index_3.jpg', title: '情景式口语对话，让孩子自然输出，流利表达' },
        { 'src': 'https://cloud.svenglish.cn/static/GroupPage/index_4.jpg', title: '思辨性阅读模式，激发孩子思维逻辑养成' }
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 4000,
      duration: 400,
      imgheight: '',
    },


    teacher: {
      list: [
        { name: 'Sarah', info: 'Sarah毕业于伦敦大学亚非学院中文系。她对少儿教育经验丰富，对教学严谨认真，热情满满。尤其擅长用肢体语言和变化丰富的表情使课堂氛围生动饱满，更能灵活的运用游戏寓教于乐，让学生轻松的提升口语及各项能力。', src: 'https://cloud.svenglish.cn/static/GroupPage/teacher2.jpg', },
        { name: 'Conor', info: 'Conor来自于美国洛杉矶，毕业于美国著名私立文理学院科尔盖特大学，并在清华大学主攻中文。Conor热情、幽默、亲和力强，总能让羞涩的孩子开口。他同时也擅长用对话手法潜移默化的培养孩子的逻辑思维。Conor在中国工作和教学超过五年。', src: 'https://cloud.svenglish.cn/static/GroupPage/teacher1.jpg', },
        { name: 'Gladys', info: 'Gladys毕业于美国加州大学伯克利分校，双休经济系与心理系，对儿童发展及教育心理学有深入研究。她高中就读英国剑桥体系国际学校，并在普林斯顿大学游学。她对中西方思维、文化及英美教育体系有独特见解。业余她喜欢旅行和阅读。', src: 'https://cloud.svenglish.cn/static/GroupPage/teacher3.jpg', },
        { name: 'Olivia', info: 'Olivia 英文专业科班出身，曾任英国领事馆文化教育处高级官员多年，负责推广英国教育与艺术项目；也负责过美国管理会计师协会上海办公室的所有工作；后迁居斯坦福大学，并在校研习儿童教育及西方艺术史。二宝妈妈，创新教育实践者。', src: 'https://cloud.svenglish.cn/static/GroupPage/teacher4.jpg', }
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 4000,
      duration: 400,
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
  timeRun(){
    var endTimeS = parseInt(this.data.countdown/1000);

    var buLing = function (num) { return num > 9 ? num : '0'+num };
    var getStr = function(s){
      var days = parseInt(s/60/60/24),
        hours = buLing(parseInt(s / 60 / 60) % 24),
        minutes = buLing(parseInt(s / 60) % 60),
          second = buLing(s % 60);
      return days + '天 ' + hours + ':' + minutes + ':' + second;
    };

    var groupTimer = setInterval(()=>{
      endTimeS--;

      if (endTimeS<=0){
        clearInterval(groupTimer);
        this.setData({
          isEnd: true
        });
      }

      this.setData({
        groupEndTime: getStr(endTimeS)
      });
    },1000);
    
  },
  getUser(userIds){
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/wechat/user-info?userId=' + userIds.join(','), // 仅为示例，并非真实的接口地址
      method: 'GET',
      success(res) {
        if (res.data.code == 1) {
          var userInfo = res.data.data;
          var courses = self.data.courses;
          for (var i = 0; i < courses.length; i++) {
            courses[i].userName = userInfo[i].userName;
            courses[i].avatarUrl = userInfo[i].avatarUrl;
          };
          self.setData({
            courses: courses
          })
          
        }
      }
    })
  },
  //获取列表
  getCourses(groupOrderId){
    var self=this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/courses', // 仅为示例，并非真实的接口地址
      data: {
        groupOrderId: groupOrderId //'148644921'
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code==1){
          var courses = res.data.data;
          self.setData({
            courses: courses
          });

          for (var i = 0; i < courses.length; i++) {
            if (app.globalData.openId == courses[i].openId) {
              self.setData({
                isJoin: true
              });
            }
          };

          if (courses.length >= self.data.groupInfo.groupMaxNumber || self.data.countdown<=0){
            self.setData({
              isEnd: true
            });
          }else{
            //开始倒计时
            self.timeRun();
          }

          var openIdArr = [];
          for (var i = 0; i < courses.length;i++){
            openIdArr.push(courses[i].openId);
          }
          self.getUser(openIdArr);

        }
      },
      fail(res) {
        
      }
    })
  },
  getGroup(groupOrderId){
    if (!groupOrderId){
      return;
    }
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/groups', // 仅为示例，并非真实的接口地址
      data: { groupOrderId: groupOrderId},
      method: 'POST',
      header: {'content-type': 'application/json'},
      success(res) {
        if (res.data.code == 1) {
          var data = res.data.data;
          self.setData({
            groupInfo: data[0]
          });

          //获取入团人员
          self.getCourses(groupOrderId);

          
        }
      }
    })
  },
  getCountdown(groupOrderId){
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/group/countdown?groupOrderId=' + groupOrderId, // 仅为示例，并非真实的接口地址
      method: 'GET',
      success(res) {
        if (res.data.code == 1) {
          //获取入团人员
          self.getGroup(groupOrderId);
          self.setData({
            countdown: res.data.data
          });
        }
      }
    })
    
  },
  goHome(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad: function (e) {

    //wx.showTabBar({});
    
    //获取团
    this.getCountdown(e.groupOrderId ? e.groupOrderId : '');
    
    
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
    
    var groupOrderId = e.currentTarget.dataset.id;

    if (!e.detail.userInfo){
      return;
    }
    //获取用户信息
    app.globalData.userInfo = e.detail.userInfo;

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });

    var putData = {
      code: app.globalData.loginCode,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    };

    wx.request({
      url: 'https://www.svenglish.cn/api/wechat/login', // 仅为示例，并非真实的接口地址
      data: putData,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        if (res.data.code == 1) {
          app.globalData.openId = res.data.data.openId;
          wx.navigateTo({
            url: '/pages/group/order/order' + (groupOrderId ? '?groupOrderId='+groupOrderId : ''),
          })
        }

      }
    });

    
  },
  
  onShareAppMessage: function (e) {
    // var dataset = e.target.dataset;
    return {
      title: '当前分享的课程',
      desc: '课程介绍',
      path: '/pages/group/index?groupOrderId=' + this.data.groupInfo.groupOrderId // 路径，传递参数到指定页面。
    }
  },
  startGroup() {
    wx.navigateTo({
      url: '/pages/group/order/order',
    });
  },
  addGroup(e) {
    
    // var dataset = e.currentTarget.dataset;
    // 判断是否已经拼团
    var courses = this.data.courses;
    console.log(courses)
    for (var i = 0; i < courses.length;i++){
      if (app.globalData.openId == courses[i].openId) {
        wx.showModal({
          content: '您已经参加过了，请查看我的拼团！',
          showCancel: false
        });
        return false;
      }
    };
    
    wx.navigateTo({
      url: '/pages/group/order/order?groupOrderId=' + this.data.groupInfo.groupOrderId,
    })
  }
})
