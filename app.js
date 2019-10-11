//app.js
App({
  onLaunch: function () {
    //默认执行，初始化
    this.updateXcxVersion();
    var that = this;
    this.setSession();
    this.refresh();
  },
  refresh: function(){
    var that = this;
    setInterval(
      function(){
        that.setSession();
      },20*60*1000
    );
  },
  setSession:function(){
    var that = this;
    var sessionId = wx.getStorageSync("sessionId");
    if (typeof sessionId == "undefined" || sessionId == null || sessionId.length == 0) {
      this.globalData.cookieObj = {};
    } else {
      this.globalData.cookieObj = { "Cookie": "JSESSIONID=" + sessionId };
    }
    // 登录
    wx.login({
      success: function (resss) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.js_code = resss.code;

        // 获取用户信息
        wx.getSetting({
          success(ress) {
            var stateAuth = ress.authSetting['scope.userInfo'];
            if (typeof (stateAuth) != "undefined" && stateAuth == true) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: function (res) {
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = res.userInfo;
                  that.globalData.encryptedData = res.encryptedData;
                  that.globalData.iv = res.iv;

                  
                  //登录保存session
                  wx.request({
                    url: 'https://wx.rapoint.com/xcx/sg/user/login',
                    header: that.globalData.cookieObj,
                    data: {
                      js_code: that.globalData.js_code,
                      avatarUrl: res.userInfo.avatarUrl,
                      city: that.globalData.userInfo.city,
                      country: that.globalData.userInfo.country,
                      gender: that.globalData.userInfo.gender,
                      language: that.globalData.userInfo.language,
                      nickName: that.globalData.userInfo.nickName,
                      province: that.globalData.userInfo.province,
                    },
                    dataType: 'json',
                    success: function (re) {
                      wx.setStorageSync("userInfo", res.userInfo);
                      wx.setStorageSync("openid", re.data.openid);

                      var cookieVal = re.header['Set-Cookie'];
                      var jsessionid = "";
                      if (typeof cookieVal == "undefined" || cookieVal == null || cookieVal.length==0){
                        
                      } else {
                        jsessionid = cookieVal.substring(11, cookieVal.indexOf(";"));
                        wx.setStorageSync("sessionId", jsessionid);
                      }

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(that.globalData);
                      }
                    },
                    fail: function (re) {
                      
                    }
                  });
                },
                fail: function (res) {
                  //拒绝授权时操作，记录日志后不做任何操作
                  wx.request({
                    url: 'https://wx.rapoint.com/xcx/sg/user/notauth',
                    header: that.globalData.cookieObj,
                    data: {
                      js_code: that.globalData.js_code,
                    },
                    dataType: 'json',
                    success: function (re) {
                      if (re.data.error_code == "0") {
                        wx.setStorageSync("openid", re.data.openid);
                      } else {
                        console.error("访问失败。");
                      }

                      var cookieVal = re.header['Set-Cookie'];
                      if (typeof cookieVal == "undefined" || cookieVal == null || cookieVal.length == 0) {

                      } else {
                        var jsessionid = cookieVal.substring(11, cookieVal.indexOf(";"));
                        wx.setStorageSync("sessionId", jsessionid);
                      }
                    },
                    fail: function (re) {

                    }
                  });
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(that.globalData);
                  }
                }
              })
            } else {
              //未授权时的操作
              wx.request({
                url: 'https://wx.rapoint.com/xcx/sg/user/openid',
                header: that.globalData.cookieObj,
                data: {
                  js_code: that.globalData.js_code,
                },
                dataType: 'json',
                success: function (re) {
                  if (re.data.error_code == "0") {
                    wx.setStorageSync("openid", re.data.openid);
                  }else{
                    console.error("访问失败。");
                  }

                  var cookieVal = re.header['Set-Cookie'];
                  if (typeof cookieVal == "undefined" || cookieVal == null || cookieVal.length == 0) {

                  } else {
                    var jsessionid = cookieVal.substring(11, cookieVal.indexOf(";"));
                    wx.setStorageSync("sessionId", jsessionid);
                  }
                },
                fail: function (re) {

                }
              });
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(that.globalData);
              }
              return;
            }
          }
        });

      }
    })
  },
  globalData: {
    userInfo: null,
    encryptedData: null,
    iv: null,
    js_code: null,
    cookieObj: null,
  },
  updateXcxVersion: function(){
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }
})