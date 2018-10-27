const app = getApp();

Page({
  formatCuteDate(s) {
    return s.substr(s.indexOf('-') + 1).replace('-', '.');
  },

  formatTimestamp(ts) {
    let d = new Date(ts * 1000);
    return app.formatNumber(d.getMonth()+1) + '.' + app.formatNumber(d.getDate());
  },

  onLoad() {
    if (!app.globalData.get_daily_music_over) {
      // console.log('not');
      app.globalData.get_daily_music_callback = this.showTodayMusic;
    } else {
      // console.log('show');
      this.showTodayMusic();
    }
  },

  showTodayMusic() {
    this.showDailyMusic(app.globalData.crt_date);
  },

  showDailyMusic(date) {
    let music = app.globalData.daily_list[date];
    if (!music.play_status)
      music.play_status = 'play';
    this.setData({
      key_date: date,
      date: this.formatCuteDate(date),
      name: music.name,
      cover: music.cover,
      singer: music.singer,
      owner: music.owner.nickname,
      avatar: music.owner.avatar,
      cmt_num: music.total_comment,
      cmt_date: this.formatTimestamp(music.create_time),
      netease_id: music.netease_id,
      play_status: music.play_status,
    })
  },

  toggleCurrentMusic($event) {
    let manager = app.globalData.audioManager;
    if (this.data.play_status === 'play') {
      this.setData({
        play_status: 'pause',
      });
      let audio_url = 'http://music.163.com/song/media/outer/url?id=' + this.data.netease_id + '.mp3';
      
      if (manager.src !== audio_url) {
        manager.src = audio_url;
        this.data.pause_time = 0;
        manager.startTime = 0;
      } else {
        manager.startTime = this.data.pause_time;
      }
      console.log(this.data.cover);
      manager.title = this.data.singer + ' - ' + this.data.name;
      manager.coverImgUrl = this.data.cover;
      manager.webUrl = 'https://music.163.com/song?id=' + this.data.netease_id;
      manager.play();
    } else {
      this.setData({
        play_status: 'play',
      });
      
      this.data.pause_time = manager.currentTime;
      manager.pause();
    }
  },

  onShareAppMessage() {
    return {
      title: 'home',
      path: 'pages/home'
    }
  },

  data: {
    date: '',
    owner: '',
    avatar: '',
    cmt_date: '',
    cmt_num: 0,
    music: '',
    singer: '',
    cover: '',
    netease_id: 0,
    audio_url: '',
    play_status: 'play',
    pause_time: 0,
  },

  touchStart(e) {
    this.setData({
      "touchStart": {
        "x": e.changedTouches[0].clientX,
        "y": e.changedTouches[0].clientY,
      }
    })
  },

  touchEnd(e) {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    
    let startX = this.data.touchStart.x;
    let startY = this.data.touchStart.y;

    if (endX - startX > 50 && Math.abs(endY - startY) < 50) {
      wx.showToast({
        title: '右滑，获取更新的音乐',
      })
    }

    if (endX - startX < -50 && Math.abs(endY - startY) < 50) {   //左滑
      wx.showToast({
        title: '左滑，获取之前的音乐',
      })
    }
  }
})
