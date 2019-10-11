//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    xcxUserVO:{
      username:'',
      telphone:''
    }
  },
  onLoad: function () {
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/userinfo/get',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {},
      dataType: 'json',
      success: function (e) {
        var xcxUserVO = _self.data.xcxUserVO;
        if (typeof (e.data.username) == "undefined" || e.data.username == "") {
          xcxUserVO.username = '';
        } else {
          xcxUserVO.username = e.data.username;
        }
        if (typeof (e.data.telphone) == "undefined" || e.data.telphone == "") {
          xcxUserVO.telphone = '';
        } else {
          xcxUserVO.telphone = e.data.telphone;
        }
        _self.setData({
          xcxUserVO: xcxUserVO
        });
      },
      fail: function (e) {

      }
    });
  },
  //点击保存事件
  formSubmit: function (e){
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/userinfo/set',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        username: e.detail.value.username,
        telphone: e.detail.value.telphone
      },
      dataType: 'json',
      success: function (res) {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 1500
        })
        wx.setStorageSync("username", e.detail.value.username);
        wx.setStorageSync("telphone", e.detail.value.telphone);
        //关闭当前页面，返回上级页面
        wx.navigateBack({
          delta:1
        });
      },
      fail: function (e) {

      }
    });
  }
});