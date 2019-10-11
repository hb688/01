//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    sgUserPO: {
      country_code: '86',
      phone_number: '182****4144',
      username: '',
      id_card: ''
    },
    viewDatas: {
      temp_phone_number: '',
      phone_message: '',
      phone_message_pl: '请输入验证码'
    }
  },
  onLoad: function () {
    var that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.onLoadAfter(data);
    })
  },
  onLoadAfter: function (data) {
    var sgUser = this.data.sgUserPO;
    var viewDatas = this.data.viewDatas;
    sgUser.country_code = data.country_code;
    sgUser.phone_number = data.phone_number;
    sgUser.username = data.username;
    sgUser.id_card = data.id_card;

    var phone_number = data.phone_number;
    var temp_phone_number = phone_number.substring(0,3);
    for (var i = 0; i < (phone_number.length - 7);i++){
      temp_phone_number += "*";
    }
    temp_phone_number += phone_number.substring(phone_number.length - 4, phone_number.length);
    viewDatas.temp_phone_number = temp_phone_number;

    this.setData({
      sgUserPO: sgUser,
      viewDatas: viewDatas
    });
  },
  sendMessage: function(e){
    //发送验证码
    var that = this;

    wx.request({
      url: 'https://wx.rapoint.com/xcx/sg/user/phone/sendmsg',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        phone_number: that.data.sgUserPO.phone_number
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '验证码发送成功',
            icon: 'success',
            duration: 1500
          });
          util.addViewhis({
            view_name: '个人中心-身份认证-短信验证',
            button_name: '验证码发送成功：手机号：' + that.data.sgUserPO.phone_number
          });
        }else{
          wx.showToast({
            title: res.data.error_message,
            icon: 'none',
            duration: 2000
          });
          util.addViewhis({
            view_name: '个人中心-身份认证-短信验证',
            button_name: '验证码发送失败：手机号：' + that.data.sgUserPO.phone_number+"|异常信息：" + res.data.error_message
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "发送验证码异常",
          icon: 'none',
          duration: 2000
        });
        util.addViewhis({
          view_name: '个人中心-身份认证-短信验证',
          button_name: '发送验证码异常：手机号：' + that.data.sgUserPO.phone_number
        });
      }
    });
  },
  //点击保存事件
  formSubmit: function (e) {
    var that = this;
    if (typeof (e.detail.value.phone_message) == "undefined" || e.detail.value.phone_message == 0) {
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.request({
      url: 'https://wx.rapoint.com/xcx/sg/user/idcard/save',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        username: e.detail.value.username,
        id_card: e.detail.value.id_card,
        phone_message: e.detail.value.phone_message
      },
      dataType: 'json',
      success: function (res) {
        if (res.data.error_code==0){
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1500
          });
          util.addViewhis({
            view_name: '个人中心-身份认证-短信验证',
            button_name: '短信验证成功：手机号：' + that.data.sgUserPO.phone_number
          });
          wx.navigateBack({
            delta: 2
          });
        }else{
          wx.showToast({
            title: res.data.error_message,
            icon: 'none',
            duration: 2000
          });
          util.addViewhis({
            view_name: '个人中心-身份认证-短信验证',
            button_name: '短信验证失败：手机号：' + that.data.sgUserPO.phone_number + "|异常信息：" + res.data.error_message
          });
        }
      },
      fail: function (e) {
        util.addViewhis({
          view_name: '个人中心-身份认证-短信验证',
          button_name: '短信验证失败：手机号：' + that.data.sgUserPO.phone_number
        });
      }
    });
  }
});