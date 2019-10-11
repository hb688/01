var saveimgurl1 = '';
var delstr1 = [];
Page({
  data: {
    array: [{
      id: 0,
      src: ''
    }],
    saveimgurl: ''
  },
  /*点击删除事件*/
  hanlderdelBtn: function (event) {
    console.log(event);
    var index = event.currentTarget.dataset.index;
    /*删除下标为index的imgList里的图片和删除按钮*/
    delstr1 = this.data.imgList.splice(index, 1);

    console.log(delstr1);
    this.setData({
      imgList: this.data.imgList, //删除后的图片列表
      delStr: this.data.delStr.concat(delstr1) //已删除的图片列表
    });

  },
  /*上传图片 */
  uploadImg: function (event) {
    console.log(event);
    this.addImg(event.currentTarget.dataset.id);
  },
  /*点击添加更多图片 */
  addMorePhoto: function (event) {
    const length = this.data.array.length;

    /*增加图片列表*/
    this.data.array = this.data.array.concat([{ id: length, src: '' }]);
    this.setData({
      array: this.data.array
    });
    console.log(this.data.array);
  },
  /*点击上传照片 */
  addImg: function (id) {
    console.log(id);
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      // sizeType: ['compressed'],
      sourceType: ['camera'],
      compressed: false,
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        that.data.array[id].src = tempFilePaths[0];

        that.setData({
          array: that.data.array
        })
        console.log(that.data.array);

        wx.uploadFile({
          url: '/upload', //开发者服务器的 url
          filePath: res.tempFilePaths[0], // 要上传文件资源的路径 String类型！！！
          name: 'file', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)
          header: {
            'content-type': 'multipart/form-data'
          }, // 设置请求的 header
          formData: {

          }, // HTTP 请求中其他额外的参数
          success: function (res) {
            console.log(res);

            var me = JSON.parse(res.data);
            console.log(me);

            saveimgurl1 += me[0].fileurl + ',';
            console.log(saveimgurl1);
            that.setData({
              saveimgurl: saveimgurl1
            })
          },
          fail: function (res) {
            console.log("图片上传失败" + res);
          }
        })

      }
    });
  },
  /**
     * 生命周期函数--监听页面加载，显示已存在的图片列表
     */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.request({
      url: "Info",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {

      },
      success: function (res) {
        console.log(res);
        var res = res.data;
        that.setData({
          imgList: res[0].picList
        });
      }
    });
  },
})
