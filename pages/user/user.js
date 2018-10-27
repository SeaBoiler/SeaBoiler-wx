Page({
  onLoad() {
    wx.showToast({
      title: '正在制作…',
      // icon: 'none',
    })
  },

  onShareAppMessage() {
    return {
      // title: 'user',
      path: 'pages/user'
    }
  },
  data: {
    list: [],
    user: {}
  },
  onLoad: function (options) {
    this.setData({
      title: options.title
    })
  }
});