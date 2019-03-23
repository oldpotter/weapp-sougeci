import {debug} from '../../config.js'
const { $Message } = require('../../components/iview/base/index.js')
const url = debug ?'http://192.168.31.99:5000/lyric':'https://shenkeling.top/lyric'
Page({
  data: {
    id: null,
    name: null,
    album: null,
    artist: null,
    lyric: '',
    loading: false, //收藏按钮状态
    db_id: null,
    fontSize: 10,
    pushingLyric: false //推送歌词到shenkeling.top
  },

  onLoad(e) {
    // console.log(e)
    this.setData({
      id: e.songId || e.id,
      name: e.name,
      album: e.album,
      artist: e.artist,
      db_id: e.db_id ? e.db_id : null,
      fontSize: getApp().globalData.fontSize
    })
    this.getLyric(this.data.id)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  copy() {
    const _this = this
    wx.setClipboardData({
      data: _this.data.lyric,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  collect() {
    const _this = this
    this.setData({
      loading: true
    })
    const db = getApp().globalData.db
    db.collection('lyrics').doc(_this.data.db_id).get({
      success(res) {
        //已经收藏了这首歌
        db.collection('lyrics').doc(_this.data.db_id).remove({
          success(res) {
            _this.setData({
              db_id: '',
              loading: false
            })
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              image: '',
              duration: 1000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        })
      },
      fail(err) {
        //没有收藏这个歌词
        db.collection('lyrics').add({
          data: {
            songId: _this.data.id,
            name: _this.data.name,
            album: _this.data.album,
            artist: _this.data.artist,
            lyric: _this.data.lyric,
            date: db.serverDate()
          },

          success(res) {
            _this.setData({
              db_id: res._id
            })
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              image: '',
              duration: 1000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          },

          fail(err) {
            console.error(err)
          },

          complete() {
            _this.setData({
              loading: false
            })
          }
        })
      }
    })


  },

  getLyric(id) {
    const _this = this
    wx.showLoading({})
    wx.cloud.callFunction({
      name: 'lyric',
      data: {
        id: _this.data.id
      },
      success(res) {
        res = JSON.parse(res.result)
        // console.log(res)
        if (!res.lrc || res.lrc.lyric.length < 0) {
          //没有歌词
          wx.showModal({
            title: '没有歌词',
            content: '',
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        } else {
          const lyric = res.lrc.lyric
            .replace(/\[[\d.:]+\]/g, '')
          _this.setData({
            lyric
          })
        }
        wx.hideLoading()
      }
    })
  },

  //推送歌词到shenkeling.top
  push() {
		const _this = this
    this.setData({
      pushingLyric: true
    })
		
		wx.request({
			url: `${url}/pushlyric`,
			data: {
				lyric:{
					name: _this.data.name,
					album: _this.data.album,
					artist: _this.data.artist,
					lyric: _this.data.lyric
				}
			},
			header: {},
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				_this.setData({ pushingLyric: false })
				$Message({
					content: `请访问${url}查看`,
					type:'success',
					duration: 10
				});
			},
			fail: function(res) {},
			complete: function(res) {},
		})
  }
})