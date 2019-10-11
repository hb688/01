//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    moduleArray: [
       { name: '首页', className: 'check', modulecode: '0' }
      // , { name: '活动', className: '', modulecode: '1' }
      // , { name: '产品', className: '', modulecode: '2'}
    ],
    hiddenView: { main: false, product: true, userwindow: true, authwindow: true},
    checkModuleCode: 0, 
    recommendList: [],
    hotList: [],
    productList: [],
    productCount: 0,
    pageNo:1,
    pageRows:15
  },

  clickProduct: function(e) {
    var id = e.currentTarget.dataset.id;

    var username = wx.getStorageSync("username");
    var telphone = wx.getStorageSync("telphone");
    if (typeof username == 'undefined' 
      || typeof telphone == 'undefined'
      || username == ''
      || telphone == ''
    ){
      this.clickOpenWindow();
      return;
    }
    wx.navigateTo({
      url: '../product/product?id='+id
    });
  },
  //点击标题时触发的事件。
  clickModuleName: function(e) {
    var modulecode = e.currentTarget.dataset.modulecode;
    
    if (this.data.checkModuleCode == modulecode){
      return;
    }
    var arr = this.data.moduleArray;
    for (var i = 0; i < arr.length;i++){
      if (arr[i].modulecode==modulecode){
        arr[i].className = 'check';
      }else{
        arr[i].className = '';
      }
    }
    this.setData({
      moduleArray:arr
      ,checkModuleCode: modulecode
    });
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.switchModule(modulecode);
  },
  //初始加载
  onLoad: function () {
    this.requestMenu();
    this.requestMainProductList();
    var _self = this;
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
        });
        var that = this;
        wx.getSetting({
          success(ress) {
            var hiddenCodes = that.data.hiddenView;
            var stateAuth = ress.authSetting['scope.userInfo'];
            if (typeof (stateAuth) != "undefined" && stateAuth == true) {
              hiddenCodes.authwindow = true;
            } else {
              hiddenCodes.authwindow = false;
            }
            that.setData({
              hiddenView: hiddenCodes
            });
          }
        });
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
  onShow: function () {
    var that = this;
    wx.getSetting({
      success(ress) {
        var hiddenCodes = that.data.hiddenView;
        var stateAuth = ress.authSetting['scope.userInfo'];
        if (typeof (stateAuth) != "undefined" && stateAuth == true) {
          hiddenCodes.authwindow = true;
        } else {
          hiddenCodes.authwindow = false;
        }
        that.setData({
          hiddenView: hiddenCodes
        });
      }
    });
  },
  //授权回调
  onGotUserInfo: function(e){
    var _self = this;
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    // 获取用户信息
    wx.getSetting({
      success(ress) {
        var stateAuth = ress.authSetting['scope.userInfo'];
        if (stateAuth == true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: function (res) {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = e.detail.userInfo;
              app.globalData.encryptedData = res.encryptedData;
              app.globalData.iv = res.iv;

              var hiddenCodes = _self.data.hiddenView;
              hiddenCodes.authwindow = true;
              _self.setData({
                hiddenView: hiddenCodes
              });

              //登录保存session
              wx.request({
                url: 'https://wx.rapoint.com/xcx/zyhb/login',
                data: {
                  encryptedData: app.globalData.encryptedData,
                  iv: app.globalData.iv,
                  js_code: app.globalData.js_code,
                  avatarUrl: app.globalData.userInfo.avatarUrl,
                  city: app.globalData.userInfo.city,
                  country: app.globalData.userInfo.country,
                  gender: app.globalData.userInfo.gender,
                  language: app.globalData.userInfo.language,
                  nickName: app.globalData.userInfo.nickName,
                  province: app.globalData.userInfo.province,
                },
                dataType: 'json',
                success: function (re) {
                  var userName = (typeof (re.data.username) == "undefined" || re.data.username == null) ? app.globalData.userInfo.nickName: re.data.username;
                  wx.setStorageSync("username", userName);
                  if (typeof (re.data.telphone) == "undefined" || re.data.telphone == null) {
                    wx.setStorageSync("telphone", re.data.telphone);
                  }
                  wx.setStorageSync("openid", re.data.openid);

                  var cookieVal = re.header['Set-Cookie'];
                  var jsessionid = cookieVal.substring(11, cookieVal.indexOf(";"));
                  wx.setStorageSync("sessionId", jsessionid);
                },
                fail: function (re) {
                  
                }
              });
            },
            fail: function (res) {
              wx.showModal({
                title: '授权提示',
                content: '由于您拒绝了用户授权，该小程序暂时无法提供服务！可以通过微信的“发现-小程序”模块删除该小程序，并重新搜索进入该小程序。',
                showCancel: false,
              });
              return;
            }
          })
        }
      }
    });
  },
  switchModule: function (modulecode) {
    var hiddenCodes = this.data.hiddenView;
    if(modulecode == 0){
      hiddenCodes.main = false;
      hiddenCodes.product = true;
    }else{
      hiddenCodes.main = true;
      hiddenCodes.product = false;
    }
    this.setData({
      pageNo: 1,
      hiddenView: hiddenCodes
    });
    if (modulecode > 0) {
      this.requestProductTypeList(this.data.pageNo);
    }else{
      this.requestMainProductList();
    }
  },
  formSubmit: function(e){
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/userinfo/set',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId")},
      data: {
        username: e.detail.value.username,
        telphone: e.detail.value.telphone
      },
      dataType: 'json',
      success: function (res) {
        wx.setStorageSync("username", e.detail.value.username);
        wx.setStorageSync("telphone", e.detail.value.telphone);
        _self.clickCloseWindow();
      },
      fail: function (res) {

      }
    });
  },
  clickCloseWindow: function () {
    var hiddenCodes = this.data.hiddenView;
    hiddenCodes.userwindow = true;
    this.setData({
      hiddenView: hiddenCodes
    });
  },
  clickOpenWindow: function(){
    var hiddenCodes = this.data.hiddenView;
    hiddenCodes.userwindow = false;
    this.setData({
      hiddenView: hiddenCodes
    });
  },
  requestMenu: function(){
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/menu/list',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: this.globalData,
      dataType: 'json',
      success: function (e) {
        if (typeof (e.data.objList) == "undefined"){
          return;
        }
        _self.setData({
          moduleArray: _self.data.moduleArray.concat(e.data.objList)
        });
      },
      fail: function (e) {

      }
    });
  },
  requestMainProductList: function(){
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/main/list',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: this.globalData,
      dataType: 'json',
      success: function (e) {
        _self.setData({
          recommendList: (typeof (e.data.recommendList) == "undefined" ? null : e.data.recommendList),
          hotList: (typeof (e.data.hotList) == "undefined" ? null : e.data.hotList)
        });
      },
      fail: function (e) {

      }
    });
  },
  requestProductTypeList: function(pageNo){
    var _self = this;
    this.setData({
      pageNo: pageNo
    });
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/product/type/list',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        type: this.data.checkModuleCode,
        page: this.data.pageNo,
        rows: this.data.pageRows
      },
      dataType: 'json',
      success: function (res) {
        if (_self.data.pageNo==1){
          _self.setData({
            productList: res.data.productList,
            productCount: res.data.productCount
          });
        }else{
          _self.setData({
            productList: _self.data.productList.concat(res.data.productList),
            productCount: res.data.productCount
          });
        }
      },
      fail: function (res) {

      }
    });
  },
  onPageScroll: function(e) {
    if (!this.data.hiddenView.main){
      return;
    }
    if (!this.checkNewList()){
      return;
    }
    //创建节点选择器
    var query = wx.createSelectorQuery();
    var height = 0;
    //选择id
    query.select('#containerDiv').boundingClientRect()
    query.exec(function (res) {
      //取高度
      height = res[0].height;
    });
    if ((e.scrollTop + 100) >= height){
      this.requestProductTypeList(this.data.pageNo+1);
    }
  },
  checkNewList: function(){
    var count = this.data.productCount;
    var pageNo = this.data.pageNo;
    var pageRows = this.data.pageRows;
    if (pageNo * pageRows >= count){
      return false;
    }
    return true;
  },
  onShareAppMessage(res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    return {
      title: '展业海报-小数点',
      path: 'pages/index/index'
    }
  }
})