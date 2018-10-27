var service = require('common/service.js');

//app.js
App({
  formatNumber: function(x) {
    if (x < 10)
      return '0' + x;
    else
      return '' + x;
  },

  formatDate: function(date) {
    return this.formatNumber(date.getFullYear()) + '-' +
      this.formatNumber(date.getMonth() + 1) + '-' +
      this.formatNumber(date.getDate());
  },

  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    let crt_date = new Date();

    this.globalData.end_date = this.formatDate(crt_date);
    this.globalData.crt_date = this.globalData.end_date;

    this.globalData.audioManager = wx.getBackgroundAudioManager();

    service.s.get_daily_music({
      end_date: this.globalData.end_date, 
      count: this.globalData.count,
    }, (resp) => {
      console.log(resp);
      if (resp.code === 0) {
        let data = resp.body;
        this.globalData.is_over = data.is_over;
        this.globalData.end_date = data.next_date;
        for (let i = 0; i < data.daily_music_list.length; i++)
          this.globalData.daily_list[data.daily_music_list[i].date] = data.daily_music_list[i].music;
        this.globalData.get_daily_music_over = true;
        // console.log('check callback');
        if (this.globalData.get_daily_music_callback) {
          // console.log('run callback');
          this.globalData.get_daily_music_callback();
        }
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        service.s.user_upload_code({code: res.code});
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              service.s.user_update_info({ encrypted_data: res.encryptedData, iv: res.iv}, (resp) => {
                this.globalData.userInfo = resp.body;
                console.log(resp.body);
              });

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    end_date: null,
    crt_date: null,
    count: 10,
    is_over: false,
    daily_list: {},
    get_daily_music_over: false,
    get_daily_music_callback: null,
  }
})