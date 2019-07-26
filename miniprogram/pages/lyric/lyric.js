import {
  debug
} from '../../config.js'
const {
  $Message
} = require('../../components/iview/base/index.js')
const url = debug ? 'http://192.168.31.99:5000/lyric' : 'https://shenkeling.top/lyric'
Page({
  data: {
    id: null,
    name: null,
    album: null,
    artist: null,
    lyric: '',
    lyricArray: [],
    ableToSelected: false,
    loading: false, //收藏按钮状态
    db_id: undefined,
    fontSize: 10,
    pushingLyric: false //推送歌词到shenkeling.top
  },

  onLoad(e) {
    
    this.setData({
      id: e.songId || e.id,
      name: e.name,
      album: e.album,
      artist: e.artist,
      db_id: e.db_id ? e.db_id : '',
      fontSize: getApp().globalData.fontSize
    })
    this.getLyric(this.data.id)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  copy() {
    const _this = this
    wx.showActionSheet({
      itemList: ['复制全部', '选择复制'],
      itemColor: '',
      success: function(res) {
        if (res.tapIndex == 0) { //复制全部
          wx.setClipboardData({
            data: _this.data.lyric,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          _this.setData({
            ableToSelected: true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //点击一行歌词
  tap(e) {
    const index = e.currentTarget.dataset.index
    const param = `lyricArray[${index}].checked`
    this.setData({
      [param]: !this.data.lyricArray[index].checked
    })
  },

  //确认复制内容
  toCopy() {
    const _this = this
    const lyric = this.data.lyricArray.filter(item => item.checked).map(item => item.content).join('\n')
    wx.setClipboardData({
      data: lyric,
      success: function(res) {
        const lyricArray = _this.data.lyricArray
				lyricArray.forEach(item => item.checked = false)
				// console.log(lyricArray)
        _this.setData({
          lyricArray,
          ableToSelected: false
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

	//收藏歌词
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
				// console.log('没有这个歌词')
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
    wx.showLoading()
		wx.request({
			url: 'https://shenkeling.top:3000/lyric?id=' + _this.data.id,
			success: function(res) {
				// console.log(res)
				if (!res.data.lrc || res.data.lrc.lyric.length < 0) {
					//没有歌词
					wx.showModal({
						title: '没有歌词',
						content: '',
						showCancel: false,
						cancelText: '',
						cancelColor: '',
						confirmText: '确定',
						confirmColor: '',
						success: function (res) {
							wx.navigateBack({
								delta: 1,
							})
						},
						fail(err){
							wx.showToast({
								title: '出错啦',
								icon: 'error',
								image: '',
								duration: 2000,
								mask: true,
								success: function (res) { },
								fail: function (res) { },
								complete: function (res) { },
							})
						}
					})
				} else {
					const lyric = res.data.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '')
					const lyricArray = lyric.split('\n').map(l => {
						return {
							checked: false,
							content: l
						}
					})
					_this.setData({
						lyric,
						lyricArray
					})
				}
				wx.hideLoading()
			},
			fail: function(res) {},
			complete: function(res) {},
		})
		/*
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
          const lyricArray = lyric.split('\n').map(l => {
            return {
              checked: false,
              content: l
            }
          })
          _this.setData({
            lyric,
            lyricArray
          })
        }
        wx.hideLoading()
      }
    })
		*/

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
        lyric: {
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
        _this.setData({
          pushingLyric: false
        })
        $Message({
          content: `请访问${url}查看`,
          type: 'success',
          duration: 10
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})