Page({
  data: {
    // tab切换  
    currentTab: 0,
    showif:true,
    showif1: false,
    showif2: false,
    title: '基本信息',
    handletitle:'办理流程',
    costtitle:"费用信息",
    // 基本信息
   baseInformation:[
     {
       "name": "产品名称",
       "id": "1",
       "soft": "YJFSL"
     },

     {
       "name": "担保金额(元)",
       "id": "2",
       "soft": "10000"
     },
     {
       "name": "出卖人",
       "id": "3",
       "soft": "张三"
     },
     {
       "name": "买受人",
       "id": "1",
       "soft": "王五"
     },
     {
       "name": "签约时间",
       "id": "2",
       "soft": "2019-04-05"
     },
      {
       "name": "金融顾问",
       "id": "2",
       "soft": "中国银行望京支行"
     }, {
        "name": "房产证号",
       "id": "2",
        "soft": "京房权证海私移字第0097088号"
     },
     {
       "name": "房屋坐落",
       "id": "2",
       "soft": "北京市海淀区建材城中路1号6号楼1单元101"
     }

   ],

    // 债权人
    creditors:[
      {
        "name": "债权人",
        "id": "1",
        "soft": "中国银行"
      },
      
      {
        "name": "支付金额（元）",
        "id": "2",
        "soft": "10000"
      },
      {
        "name": "收款账户",
        "id": "3",
        "soft": "张三"
      },
      {
        "name": "收款账号",
        "id": "1",
        "soft": "6227000120010479979"
      },
      {
        "name": "开户行",
        "id": "2",
        "soft": "中国银行望京支行"
      }


    ],
    // 费有信息
    costInformation: [
      {
        "name": "类型",
        "id": "1",
        "soft": "借贷"
      },
      {
        "name": "金额（元）",
        "id": "2",
        "soft": "10000"
      },
      {
        "name": "操作时间",
        "id": "3",
        "soft": "2019-10-10"
      },
      {
        "name": "类型",
        "id": "1",
        "soft": "借贷"
      },
      {
        "name": "金额（元）",
        "id": "2",
        "soft": "10000"
      },
      {
        "name": "操作时间",
        "id": "3",
        "soft": "2019-10-10"
      }
    ]
  },
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
 
      return false;
    } else {
      if (e.target.dataset.current == "1") {
        this.setData({
         
          showif1: true,
          showif: false,
          showif2: false
        })
      } else if (e.target.dataset.current == "0") {
        this.setData({
         
          showif: true,
          showif1: false,
          showif2: false
        })
      } else {
        this.setData({
         
          showif2: true,
          showif1: false,
          showif: false
        })
      }
      that.setData({
        currentTab: e.target.dataset.current,

      })
    }
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
     
    })

  },
  // 你可以直接把要修改的位置拼成字符串，然后setData({ str: data })
  // catchTouchMove: function (res) {
  //   return false
  // },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    // wx.request({
    //   // url: './a.json',
    //   // header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
    //   data: {},
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       employees: res.data
    //     })
    //   },
    //   error:function(e){

    //   }
    //   })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
   
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})