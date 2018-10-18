var request = function() {
  var r = new Object();
  r.api_host = 'https://seaboiler.6-79.cn/api';
  r.token = wx.getStorageSync('token') || null;

  r.save_token = function(token) {
    wx.setStorageSync('token', token);
    this.token = token;
  }

  r.common_method = function(method, url, data, succ) {
    wx.request({
      url: this.api_host + url,
      method: method,
      data: data,
      header: { 
        'Content-type': 'application/json',
        'token': this.token 
      },
      success: this.succ_handler(succ)
    })
  }

  r.get = function (url, data, succ) {
    this.common_method('GET', url, data, succ);
  }

  r.post = function(url, data, succ) {
    this.common_method('POST', url, data, succ)
  }

  r.put = function(url, data, succ) {
    this.common_method('PUT', url, data, succ)
  }

  r.succ_handler = function(succ_callback) {
    return function(resp) {
      resp = resp.data;
      console.log(resp);
      if (resp.code !== 0) {
        wx.showToast({
          title: resp.msg,
          icon: 'none',
        });
      }
      if (succ_callback) {
        succ_callback(resp);
      }
    }
  };

  return r;
}();

var service = function() {
  var s = new Object();
  s.user_upload_code = function({code}) {
    request.get('/user/code', arguments[0], function(resp) {
      request.save_token(resp.body.token);
    });
  }
  s.user_update_info = function({encrypted_data, iv}, succ) {
    request.put('/user/', arguments[0], succ)
  }
  s.get_music_list = function({user_id}, succ) {
    request.get('/music/list', arguments[0], succ)
  }
  s.recommend_music = function({url}, succ) {
    request.post('/music/recommend', arguments[0], succ)
  }
  s.consider_music_list = function({start, count}, succ) {
    request.get('/music/consider', arguments[0], succ)
  }
  s.review_music = function({netease_id, accept, reason}, succ) {
    request.put('/music/consider', arguments[0], succ)
  }
  s.get_daily_music = function({end_date, count}, succ) {
    request.get('/music/daily', arguments[0], succ)
  }
  s.get_message = function({only_unread, start, count}, succ) {
    request.get('/message/', arguments[0], succ)
  }
  s.read_message = function({msg_id}, succ) {
    request.put('/message/', arguments[0], succ)
  }
  return s;
}();

module.exports.s = service;
