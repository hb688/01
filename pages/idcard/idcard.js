//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    sgUserPO: {
      username: '',
      id_card: '',
      country_code: '',
      phone_number: '',
      username_placeholder: '请输入您的姓名',
      id_card_placeholder: '请输入您的身份证号'
    },
    isFirst: true,
    button_color: '',
    hiddenDatas:{
      username_hidden: true,
      idcard_hidden: true,
    }
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/sg/user/getsinfo',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {},
      dataType: 'json',
      success: function (e) {
        var xsxUser = e.data.xsxUser;
        var sgUser = that.data.sgUserPO;
        if (typeof (xsxUser.sgUserPO) != "undefined" && xsxUser.sgUserPO != null) {
          sgUser.username_placeholder = xsxUser.sgUserPO.username;
          sgUser.id_card_placeholder = xsxUser.sgUserPO.id_card;
          sgUser.phone_number = xsxUser.sgUserPO.phone_number;
          sgUser.country_code = xsxUser.sgUserPO.country_code;
          var isFirst = true;
          if ((typeof (xsxUser.sgUserPO.username) == "undefined" || xsxUser.sgUserPO.username.length == 0) && 
            (typeof (xsxUser.sgUserPO.id_card) == "undefined" || xsxUser.sgUserPO.id_card.length == 0) ){
            isFirst = true;
          }else{
            isFirst = false;
            if (typeof (that.data.sgUserPO.phone_number) == "undefined" || that.data.sgUserPO.phone_number.length == 0) {
              wx.showToast({
                title: '绑定手机号后才能对身份证信息进行修改！',
                icon: 'none',
                duration: 2000
              });
            }
          }
          that.setData({
            sgUserPO: sgUser,
            isFirst: isFirst
          });
        }
      },
      fail: function (e) {

      }
    });
  },
  onShow: function(){
    util.addViewhis({
      view_name: '个人中心-身份认证',
      button_name: ''
    });
  },
  //点击保存事件
  formSubmit: function (e) {
    var that = this;
    if (!that.data.isFirst && (typeof (that.data.sgUserPO.phone_number) == "undefined" || that.data.sgUserPO.phone_number.length == 0)){
      wx.showToast({
        title: '请先绑定手机号！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (typeof (e.detail.value.username) == "undefined" || e.detail.value.username.length == 0){
      wx.showToast({
        title: '请输入真实姓名！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (typeof (e.detail.value.id_card) == "undefined" || !util.checkIdCard(e.detail.value.id_card)) {
      wx.showToast({
        title: '请输入身份证号！',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (that.data.isFirst) {
      wx.request({
        url: 'https://wx.rapoint.com/xcx/sg/user/idcard/save',
        header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
        data: {
          username: e.detail.value.username,
          id_card: e.detail.value.id_card
        },
        dataType: 'json',
        success: function (res) {
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1500
          });
          wx.navigateBack({
            delta: 1
          });
          util.addViewhis({
            view_name: '个人中心-身份认证',
            button_name: '身份认证-成功'
          });
        },
        fail: function (e) {
          util.addViewhis({
            view_name: '个人中心-身份认证',
            button_name: '身份认证-失败'
          });
        }
      });
    }else{
      wx.navigateTo({
        url: '../telphone/telphone',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            username: e.detail.value.username,
            id_card: e.detail.value.id_card,
            phone_number: that.data.sgUserPO.phone_number,
            country_code: that.data.sgUserPO.country_code,
          });
        }
      });
      util.addViewhis({
        view_name: '个人中心-身份认证-短信验证',
        button_name: ''
      });
    }
  },
  bindKeyInputUsername: function (e) {
    var hiddenDatas = this.data.hiddenDatas;
    var sgUser = this.data.sgUserPO;
    var button_color = '';
    sgUser.username = e.detail.value.trim();
    hiddenDatas.username = e.detail.value.trim();
    if (typeof (e.detail.value) != "undefined" && e.detail.value != null && e.detail.value.trim().length > 0){
      hiddenDatas.username_hidden = false;
    }else{
      hiddenDatas.username_hidden = true;
    }

    if (typeof (e.detail.value) != "undefined" && e.detail.value != null && e.detail.value.trim().length>0
      && typeof (sgUser.id_card) != "undefined" && sgUser.id_card != null && sgUser.id_card.length > 0
    ){
      button_color = 'red';
    }else{
      button_color = '';
    }
    this.setData({
      sgUserPO: sgUser,
      hiddenDatas: hiddenDatas,
      button_color: button_color
    })
    return e.detail.value.trim();
  },
  bindKeyInputIdcard: function (e) {
    var hiddenDatas = this.data.hiddenDatas;
    var sgUser = this.data.sgUserPO;
    var button_color = '';
    sgUser.id_card = e.detail.value.trim();
    hiddenDatas.idcard = e.detail.value.trim();
    if (typeof (e.detail.value) != "undefined" && e.detail.value != null && e.detail.value.trim().length > 0) {
      hiddenDatas.idcard_hidden = false;
    } else {
      hiddenDatas.idcard_hidden = true;
    }

    if (typeof (e.detail.value) != "undefined" && e.detail.value != null && e.detail.value.trim().length > 0
      && typeof (sgUser.username) != "undefined" && sgUser.username != null && sgUser.username.length > 0
    ) {
      button_color = 'red';
    } else {
      button_color = '';
    }
    this.setData({
      sgUserPO: sgUser,
      hiddenDatas: hiddenDatas,
      button_color: button_color
    })
    return e.detail.value.trim();
  },
  clearInputUsername: function(e){
    var sgUser = this.data.sgUserPO;
    var hiddenDatas = this.data.hiddenDatas;
    sgUser.username = '';
    hiddenDatas.username_hidden = true;
    this.setData({
      sgUserPO: sgUser,
      button_color: '',
      hiddenDatas: hiddenDatas
    })
  },
  clearInputIdcard: function (e) {
    var sgUser = this.data.sgUserPO;
    var hiddenDatas = this.data.hiddenDatas;
    sgUser.id_card = '';
    hiddenDatas.idcard_hidden = true;
    this.setData({
      sgUserPO: sgUser,
      button_color: '',
      hiddenDatas: hiddenDatas
    })
  },
});