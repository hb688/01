//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    detailInfo: {
      id: 0,
      imgPath: '',
    },
    checkLike: '',
    defaultPath: "http://wx.rapoint.com/xcx/zyhb/product/detail/img?id={id}&open_id={open_id}&vs={version}",
    defaultDownloadPath: "https://wx.rapoint.com/xcx/zyhb/product/detail/{id}/{open_id}/image.jpg",
    pageRows: 3,
    productList: [],
    zyhbSupportPO: {},
    zyhbVO: {},
  },
  onLoad: function (option) {
    var detailInfo = this.data.detailInfo;
    detailInfo.imgPath = this.data.defaultPath
      .replace('{id}', option.id)
      .replace('{open_id}', wx.getStorageSync("openid"))
      .replace('{version}', Math.round(Math.random() * 100));
    detailInfo.id = option.id;
    this.setData({
      detailInfo: detailInfo
    });
    this.getProductDetail();
    this.loadRecommendProduct();
  },
  getProductDetail: function(){
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/product/detail',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        id: this.data.detailInfo.id
      },
      dataType: 'json',
      success: function (res) {
        var checkLike = '-check';
        if (res.data.zyhbSupportPO == null || typeof res.data.zyhbSupportPO == "undefined"){
          checkLike = '';
          _self.setData({
            zyhbVO: res.data.zyhbVO,
            checkLike: checkLike,
          });
        }else{
          _self.setData({
            zyhbSupportPO: res.data.zyhbSupportPO,
            zyhbVO: res.data.zyhbVO,
            checkLike: checkLike,
          });
        }
        
      },
      fail: function (res) {

      }
    });
  },
  clickOpenImage: function(e){
    wx.previewImage({
      urls: [this.data.detailInfo.imgPath]
    });
  },
  clickDownloadImg: function(){
    wx.showLoading({
      title:'正在保存图片'
    });
    wx.downloadFile({
      url: this.data.defaultDownloadPath.replace('{id}', this.data.detailInfo.id).replace('{open_id}', wx.getStorageSync("openid")), 
      // 仅为示例，并非真实的资源
      header: {
        'Content-Type':'application/octet-stream',
      },
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.getSetting({
            success(ress) {
              if (!ress.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({ 
                  scope: "scope.writePhotosAlbum",
                  success() {
                    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function (data) {
                        wx.hideLoading();
                        wx.showModal({
                          title: '提示',
                          content: '图片已保存到手机',
                          showCancel: false,
                        });
                      },
                    });
                  },
                  fail(){
                    wx.hideLoading();
                  }
                })
              }else{
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (data) {
                    wx.hideLoading();
                    wx.showModal({
                      title: '提示',
                      content: '图片已保存到手机',
                      showCancel: false,
                    });
                  },
                });
              }
            }
          })

          // 保存图片到本地
          
          // var tempPath = res.tempFilePath;
          // wx.saveFile({
          //   tempFilePath: tempPath,
          //   success: function (res) {
          //     // wx.showModal({
          //     //   title: '提示',
          //     //   content: '图片以保存至您的手机',
          //     //   showCancel: false,
          //     // });
          //     wx.showModal({
          //       title: '图片地址',
          //       content: res.savedFilePath,
          //       showCancel: false,
          //     });
          //   }
          // })
        }
      }
    })
  },
  reloadProducts: function(){
    this.loadRecommendProduct();
  },
  loadRecommendProduct: function(){
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/product/recommend/list',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        rows: this.data.pageRows,
        id_not_in:this.data.detailInfo.id
      },
      dataType: 'json',
      success: function (res) {
        _self.setData({
          productList: res.data.productList,
        });
      },
      fail: function (res) {

      }
    });
  },
  clickProduct: function (e) {
    var id = e.currentTarget.dataset.id;
    //关闭当前页面，跳转相应页面
    wx.redirectTo({
      url: '../product/product?id=' + id
    });
    //保留当前页面，跳转相应页面
    // wx.navigateTo({
    //   url: '../product/product?id=' + id
    // });
  },
  onShareAppMessage: function(res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    return {
      title: '展业海报-小数点',
      path: 'pages/index/index'
    }
  },
  clickShareButton: function(){
    wx.showToast({
      title: '点击图片并长按发送给朋友或保存到相册',
      icon: 'none',
      duration: 2000
    })
  },
  clickLikeButton: function(){
    if (this.data.checkLike == '-check'){
      return;
    }
    var _self = this;
    wx.request({
      url: 'https://wx.rapoint.com/xcx/zyhb/product/support/add',
      header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
      data: {
        id: this.data.detailInfo.id
      },
      dataType: 'json',
      success: function (res) {
        var checkLike = '-check';
        _self.setData({
          checkLike: checkLike,
        });
      },
      fail: function (res) {

      }
    });
  }
});