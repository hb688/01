// pages/expressDetail/expressDetail.js
Page({

      /**
       * 页面的初始数据
       */
      data: {
        process: [{
            name: '签约',
            state: "已完成",
            time: '2019-10-08'
          },
          {
            name: '公正',
            state: "未开始",
            time: '2019-10-08'
          },
          {
            name: '确权',
            state: "未开始",
            time: '2019-10-08',
            info: '审批通过'
          },
          {
            name: '风险审批',
            state: "未开始",
            time: '2019-10-08',
            info: '审批通过'
          },
          {
            name: '支付房款',
            state: "未开始",
            time: '2019-10-08',
            info: '办理中'
          },
          {
            name: '还款',
            state: "未开始",
            time: '2019-10-08',
            info: '办理中'
          },
          {
            name: '解押',
            state: "未开始",
            time: '2019-10-08',
            info: '已完成'
          },
          {
            name: '办结',
            state: "未开始",
            time: '2019-10-08',
            info: '审批通过'
          }
        ],
      },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

        },
      })