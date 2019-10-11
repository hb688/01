//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    content: '关于小数点的详细内容，阿基里斯贷款就福利卡时间段福利科技埃里克森，阿斯顿发了看见爱上来看的房间里卡视角。'
  },
  onLoad: function () {
    var that = this;
    util.addViewhis({
      view_name: '个人中心-关于小数点',
      button_name: ''
    });
    // wx.request({
    //   url: 'https://wx.rapoint.com/xcx/zyhb/userinfo/get',
    //   header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
    //   data: {},
    //   dataType: 'json',
    //   success: function (e) {
    //     var xcxUserVO = that.data.xcxUserVO;
    //     if (typeof (e.data.username) == "undefined" || e.data.username == "") {
    //       xcxUserVO.username = '';
    //     } else {
    //       xcxUserVO.username = e.data.username;
    //     }
    //     if (typeof (e.data.telphone) == "undefined" || e.data.telphone == "") {
    //       xcxUserVO.telphone = '';
    //     } else {
    //       xcxUserVO.telphone = e.data.telphone;
    //     }
    //     that.setData({
    //       xcxUserVO: xcxUserVO
    //     });
    //   },
    //   fail: function (e) {

    //   }
    // });
  },

});