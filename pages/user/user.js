//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    xcxUserVO: {
      head_img: '/pages/websrc/img/plat/logo.png',
      username: '',
      phone_number: ''
    },
    viewDatas: {
      login_button: '注册/登录',
      login_button_hidden: false,
      customer_service_telphone: '010-58318999',
      user_idcard: '未授权',
      user_idcard_hidden: true,
      user_idcard_color: 'red',
      user_telphone: '未绑定',
      user_telphone_hidden: true,
      user_telphone_color: 'red',
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this;
    util.addViewhis({
      view_name: '个人中心',
      button_name: ''
    });
    // var userInfo = wx.getStorageSync("userInfo");
    // var userInfo = wx.getStorageSync("openid");
    if (app.globalData.userInfo) {
      that.authUserInfo();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.authUserInfo();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.authUserInfo();
        }
      })
    }
  },
  authUserInfo: function(){
    var that = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/sg/user/getinfo',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {},
      dataType: 'json',
      success: function (e) {
        var xsxUser = e.data.xsxUser;
        if (xsxUser.appid == null || typeof (xsxUser.appid) == "undefined" || xsxUser.appid.length==0){

        } else {
          var xcxUserVO = that.data.xcxUserVO;
          var viewDatas = that.data.viewDatas;
          var userInfo = wx.getStorageSync("userInfo");
          if (typeof (xsxUser.sgUserPO) == "undefined" || xsxUser.sgUserPO==null){
            xcxUserVO.head_img = userInfo.avatarUrl;
            xcxUserVO.username = userInfo.nickName;
            viewDatas.user_idcard_hidden = false;
            viewDatas.user_telphone_hidden = false;
          }else{
            xcxUserVO.head_img = userInfo.avatarUrl;
            var sgUserPO = xsxUser.sgUserPO;
            if (typeof (sgUserPO.username) == "undefined" || sgUserPO.username == null || sgUserPO.username.length == 0) {
              viewDatas.user_idcard_hidden = false;
            } else {
              xcxUserVO.username = sgUserPO.username;
              viewDatas.user_idcard_color = '';
              viewDatas.user_idcard = '已认证';
              viewDatas.user_idcard_hidden = false;
            }
            if (typeof (sgUserPO.phone_number) == 'undefined' || sgUserPO.phone_number == null || sgUserPO.phone_number.length == 0) {
              viewDatas.user_telphone_hidden = false;
            } else {
              xcxUserVO.phone_number = sgUserPO.phone_number;
              viewDatas.user_telphone_hidden = false;
              viewDatas.user_telphone_color = '';
              var phone_number = sgUserPO.phone_number;
              var temp_phone_number = phone_number.substring(0, 3);
              for (var i = 0; i < (phone_number.length - 7); i++) {
                temp_phone_number += "*";
              }
              temp_phone_number += phone_number.substring(phone_number.length - 4, phone_number.length);
              viewDatas.user_telphone = temp_phone_number;
            }
          }
          
          viewDatas.login_button_hidden = true;
          that.setData({
            xcxUserVO: xcxUserVO,
            viewDatas: viewDatas
          });
        }
        
      },
      fail: function (e) {
      }
    });
  },
  //跳转修改用户信息界面
  clickUpdateUserInfo: function(){
    wx.navigateTo({
      url: '../userinfo/userinfo'
    });
  },
  onShareAppMessage(res) {
    return {
      title: '小数点订单查询',
      path: 'pages/user/user'
    }
  },
  //授权回调
  onGotUserInfo: function (e) {
    var that = this;
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    // 获取用户信息

    wx.login({
      success: function (resss) {
        wx.getSetting({
          success(ress) {
            var stateAuth = ress.authSetting['scope.userInfo'];
            if (stateAuth == true) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: function (res) {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = e.detail.userInfo;
                  // app.globalData.encryptedData = res.encryptedData;
                  // app.globalData.iv = res.iv;
                  var xcxUserVO = that.data.xcxUserVO; 
                  var viewDatas = that.data.viewDatas;
                  viewDatas.login_button_hidden = true;
                  var userInfo = wx.getStorageSync("userInfo");
                  xcxUserVO.head_img = userInfo.avatarUrl;
                  xcxUserVO.username = userInfo.nickName;
                  
                  that.setData({
                    xcxUserVO: xcxUserVO,
                    viewDatas: viewDatas
                  });

                  //登录保存session
                  wx.request({
                    url: 'https://wx.rapoint.com/xcx/sg/user/login',
                    header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
                    data: {
                      js_code: resss.code,
                      avatarUrl: userInfo.avatarUrl,
                      city:      userInfo.city,
                      country:   userInfo.country,
                      gender:    userInfo.gender,
                      language:  userInfo.language,
                      nickName:  userInfo.nickName,
                      province:  userInfo.province,
                    },
                    dataType: 'json',
                    success: function (re) {
                      //授权完毕
                      var userinfo2 = re.data.userinfo;
                      var xcxUserVO = that.data.xcxUserVO;
                      var viewDatas = that.data.viewDatas;
                      viewDatas.login_button_hidden = true;
                      if (userinfo2 == null || typeof userinfo2 == "undefined") {
                        viewDatas.user_idcard_hidden = false;
                        viewDatas.user_telphone_hidden = false;
                      }else{
                        if (typeof userinfo2.username != 'undefined' && userinfo2.username.length > 0) {
                          xcxUserVO.username = username;
                          viewDatas.user_idcard_hidden = true;
                        } else {
                          viewDatas.user_idcard_hidden = false;
                        }
                        if (typeof userinfo2.phone_number != 'undefined' && userinfo2.phone_number.length > 0) {
                          //viewDatas.user_telphone_hidden = true;
                          viewDatas.user_telphone_hidden = false;
                          viewDatas.user_telphone_color = '';
                          var phone_number = userinfo2.phone_number;
                          var temp_phone_number = phone_number.substring(0, 3);
                          for (var i = 0; i < (phone_number.length - 7); i++) {
                            temp_phone_number += "*";
                          }
                          temp_phone_number += phone_number.substring(phone_number.length - 4, phone_number.length);
                          viewDatas.user_telphone = temp_phone_number;
                        } else {
                          viewDatas.user_telphone_hidden = false;
                        }
                      }
                      
                      that.setData({
                        xcxUserVO: xcxUserVO,
                        viewDatas: viewDatas
                      });
                      util.addViewhis({
                        view_name: '个人中心',
                        button_name: '授权登录-成功'
                      });
                    },
                    fail: function (re) {
                      var viewDatas = that.data.viewDatas;
                      viewDatas.user_idcard_hidden = false;
                      viewDatas.user_telphone_hidden = false;
                      that.setData({
                        viewDatas: viewDatas
                      });
                      util.addViewhis({
                        view_name: '个人中心',
                        button_name: '授权登录-失败'
                      });
                    }
                  });
                },
                fail: function (res) {
                  return;
                }
              })
            } else {
              var viewDatas = that.data.viewDatas;
              viewDatas.user_idcard_hidden = false;
              viewDatas.user_telphone_hidden = false;
              that.setData({
                viewDatas: viewDatas
              });
              util.addViewhis({
                view_name: '个人中心',
                button_name: '授权登录-拒绝'
              });
            }
          }
        });
      }
    });
  },
  tapCallTel: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.viewDatas.customer_service_telphone,
      success: function (){
        util.addViewhis({
          view_name: '个人中心',
          button_name: '客服热线-拨打'
        });
      },
      fail: function () {
        util.addViewhis({
          view_name: '个人中心',
          button_name: '客服热线-取消拨打'
        });
      }
    })

    
  },
  tapAboutUs: function(){
    wx.navigateTo({
      url: '../about/about'
    });
  },
  tapIdcard: function () {
    wx.navigateTo({
      url: '../idcard/idcard'
    });
  },
  getPhoneNumber: function(e){
    var that = this;
    wx.login({
      success(ress) {
        if (ress.code) {
          //发起网络请求
          wx.request({
            url: 'https://wx.rapoint.com/xcx/sg/user/phone/save',
            header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
            data: {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              js_code: ress.code
            },
            dataType: 'json',
            success: function (res) {
              if (res.data.error_code == 0) {
                var xcxUserVO = that.data.xcxUserVO;
                var viewDatas = that.data.viewDatas;
                xcxUserVO.phone_number = res.data.phone_number;
                viewDatas.user_telphone_hidden = false;
                viewDatas.user_telphone_color = '';
                var phone_number = res.data.phone_number;
                var temp_phone_number = phone_number.substring(0, 3);
                for (var i = 0; i < (phone_number.length - 7); i++) {
                  temp_phone_number += "*";
                }
                temp_phone_number += phone_number.substring(phone_number.length - 4, phone_number.length);
                viewDatas.user_telphone = temp_phone_number;
                that.setData({
                  xcxUserVO: xcxUserVO,
                  viewDatas: viewDatas
                });
                wx.showToast({
                  title: '提交成功！',
                  icon: 'success',
                  duration: 1500
                });
                util.addViewhis({
                  view_name: '个人中心',
                  button_name: '绑定手机号-成功'
                });
              } else {
                wx.showToast({
                  title: res.data.error_message,
                  icon: 'none',
                  duration: 2000
                });
                util.addViewhis({
                  view_name: '个人中心',
                  button_name: '绑定手机号-失败'
                });
              }
            },
            fail: function (e) {
              util.addViewhis({
                view_name: '个人中心',
                button_name: '绑定手机号-失败'
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  }
});
