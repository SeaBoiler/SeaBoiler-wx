Page({
  onShareAppMessage() {
    return {
      title: 'user',
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