//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    originator: true,
    name: '',
    mobile: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading:false,
    groupOrderId:null,

    //课程
    courseTitle: '试听体验课程：儿童外教启蒙/Wonders课程浦东碧云百富丽山庄',
    courseId: '',
    courseItems:[
      { 'name':'零基础学童英语课程',id: 10001},
      { 'name': '高阶版对接入学英语课程', id: 10002 },
      { 'name': '初中英语课程', id: 10003 },
    ],

    //组团人数
    people: [2,3,4,5],
    peopleIndex: 0,

    //可选时间
    tryTimeArr: [
      { keyName: 'WORKDAY_DAY', text: '工作日白天 9:00~12:00', checked: false},
      { keyName: 'WORKDAY_NIGHT', text: '工作日晚上 18:00~20:00', checked:false},
      { keyName: 'WEEKEND_DAY', text: '双休日白天 9:00~12:00', checked: false},
      { keyName: 'WEEKEND_NIGHT', text: '双休日晚上 18:00~20:00', checked: false },
    ],
    tryTime: [],

    //备注说明
    comments: '',
    //提供场地
    hasSpace:false,

    amount: 6388

  },
  //选择课程
  courseChange(e){
    this.setData({
      courseId: e.detail.value
    });
  },
  //查看课程详情
  courseDetail(e){
    console.log(e.currentTarget.dataset.id);
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
  changeTime(e){
    var index = e.currentTarget.dataset.index;
    var newData = JSON.parse(JSON.stringify(this.data.tryTimeArr));
    var checkNum = 0;
    for (var i = 0; i < newData.length;i++){
      if (newData[i].checked){
        checkNum++;
      }
    }
    if (checkNum > 1 && !newData[index].checked){
      return;
    }

    
    newData[index].checked = !newData[index].checked;
    this.setData({
      tryTimeArr: newData
    });

    var tryTimeArr = this.data.tryTimeArr;
    var newTime = [];
    for (var i = 0; i < tryTimeArr.length; i++) {
      if (tryTimeArr[i].checked) {
        newTime.push(tryTimeArr[i].keyName);
      }
    }
    this.setData({
      tryTime:newTime
    })
  },
  hasSpaceChange(e){
    this.setData({
      hasSpace: !this.data.hasSpace
    });
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindComments(e){
    this.setData({
      comments: e.detail.value
    })
  },
  //创建团
  createGroup(){
    var self = this;

    if (self.data.name == ''){
      wx.showModal({
        content: '请填写联系人',
        showCancel: false
      });
    } else if (!/^(13|14|15|17|18)\d{9}$/.test(self.data.mobile)){
      wx.showModal({
        content: '请填写正确的联系电话',
        showCancel: false
      });
    } else if (!self.data.courseId) {
      wx.showModal({
        content: '请选择体验课程',
        showCancel: false
      });
    } else if (self.data.tryTime.length==0) {
      wx.showModal({
        content: '请选择试听时间',
        showCancel: false
      });
    }else{
      
      //检测并开启loading
      if (this.data.loading) {
        return;
      }
      this.setData({
        loading: true
      });

      wx.request({
        url: 'https://www.svenglish.cn/api/order/group', // 仅为示例，并非真实的接口地址
        data: {
          "courseId": this.data.courseId,
          "groupNumberNeed": this.data.people[this.data.peopleIndex]
        },
        method: 'PUT',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code==1) {
            self.setData({
              groupOrderId: res.data.data.groupOrderId
            });
            self.addGroup();
          }else{
            //关闭loading
            self.setData({
              loading: false
            });
            wx.showModal({
              content: '请求失败，请重试！',
              showCancel: false
            });
          }
        },
        fail(res) {
          //关闭loading
          self.setData({
            loading: false
          });
          wx.showModal({
            content: '请求失败，请重试！',
            showCancel: false
          });
        }
      })
    }
  },
  //加入团
  addGroup(){
    var self = this;
    
    var putData = {
      "groupOrderId": this.data.groupOrderId,
      "openId": app.globalData.openId,
      "originator": this.data.originator,  //是否发起人
      "courseId": this.data.courseId,  //课程ID
      "provideTime": this.data.tryTime.join(','),
      "contactName": this.data.name,
      "contactPhone": this.data.mobile,
      "amount": this.data.amount,  //价格
      "comments": this.data.comments,
      "provideSpace": this.data.hasSpace,
    };

    //检测并开启loading
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true
    });

    // if (!putData.originator){
    //   delete putData.courseId
    // }

    console.log(putData);

    wx.request({
      url: 'https://www.svenglish.cn/api/order/course', // 仅为示例，并非真实的接口地址
      data: putData,
      method: 'PUT',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data.code!=1) {
          //关闭loading
          self.setData({
            loading: false
          });
        }

        
      },
      fail(res) {
        //关闭loading
        self.setData({
          loading: false
        });
      }
    })
  },

  //拼团
  bindPintuan:function(){
    var self = this;
    if (this.data.groupOrderId){
      

      if (self.data.name == '') {
        wx.showModal({
          content: '请填写联系人',
          showCancel: false
        });
      } else if (!/^(13|14|15|17|18)\d{9}$/.test(self.data.mobile)) {
        wx.showModal({
          content: '请填写正确的联系电话',
          showCancel: false
        });
      } else if (self.data.tryTime.length == 0) {
        wx.showModal({
          content: '请选择试听时间',
          showCancel: false
        });
      } else {
        this.addGroup();
      }
      
    }else{
      this.createGroup();
    }
    
    
  },
  //获取团的课程id
  getCourseId(groupOrderId){
    var self = this;
    wx.request({
      url: 'https://www.svenglish.cn/api/order/groups', // 仅为示例，并非真实的接口地址
      data: {
        groupOrderId: groupOrderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 1){
          var courseId = res.data.data[0].courseId;
          //设置团标题和团id
          var courseItems = self.data.courseItems;
          for (var i = 0; i < courseItems.length; i++) {
            if (courseItems[i].id == courseId) {
              self.setData({
                courseId: courseId,
                courseTitle: courseItems[i].name
              });
              break;
            }
          }
        }
        
      }
    })
  },
  onLoad: function (e) {
    console.log(e);
    if (e.groupOrderId){
      this.setData({
        originator: false,
        groupOrderId: e.groupOrderId
      });
      //如果是加入的团，则获取课程ID，用于展示课程标题
      this.getCourseId(e.groupOrderId);
    }



    
  }
})
