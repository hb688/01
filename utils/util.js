const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const checkIdCard = idcard => {
  const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!regIdCard.test(idcard)) {
    return false;
  } else {
    return true;
  }
}

const addViewhis = option => {
  wx.request({
    url: 'https://wx.rapoint.com/xcx/sg/visit/his/add',
    header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
    data: {
      view_name: option.view_name,
      button_name: option.button_name
    },
    dataType: 'json',
    success: function (e) {
      console.log("添加日志成功：页面：" + option.view_name + "、按钮：" + option.button_name);
    },
    fail: function (e) {
      console.log("添加日志失败：页面：" + option.view_name + "、按钮：" + option.button_name);
    }
  });
}

module.exports = {
  formatTime: formatTime,
  checkIdCard: checkIdCard,
  addViewhis: addViewhis
}

