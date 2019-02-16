Page({
  data: {
    id: null,
    name: null,
    album: null,
    artist: null,
    lyric: null,
    loading: false,//收藏按钮状态
		db_id: null
  },

  onLoad(e) {
		// console.log(e)
    this.setData({
      id: e.songId || e.id,
      name: e.name,
      album: e.album,
      artist: e.artist,
			db_id: e.db_id
    })
    this.getLyric(this.data.id)
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
			success(res){
				//已经收藏了这首歌
				db.collection('lyrics').doc(_this.data.db_id).remove({
					success(res){
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
			fail(err){
				//没有收藏这个歌词
				db.collection('lyrics').add({
					data: {
						songId: _this.data.id,
						name: _this.data.name,
						album: _this.data.album,
						artist: _this.data.artist,
						lyric: _this.data.lyric
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
							success: function (res) { },
							fail: function (res) { },
							complete: function (res) { },
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
      }
    })
    // wx.request({
    //   url: 'http://shenkeling.top:3000/lyric?id=' + _this.data.id,
    //   success: function(res) {
    //     if (!res.data.lrc || res.data.lrc.lyric.length < 0) {
    //       //没有歌词
    // 			wx.showModal({
    // 				title: '没有歌词',
    // 				content: '',
    // 				showCancel: false,
    // 				cancelText: '',
    // 				cancelColor: '',
    // 				confirmText: '确定',
    // 				confirmColor: '',
    // 				success: function(res) {
    // 					wx.navigateBack({
    // 						delta: 1,
    // 					})
    // 				},
    // 				fail: function(res) {},
    // 				complete: function(res) {},
    // 			})
    //     } else {
    //       const lyric = res.data.lrc.lyric
    //         .replace(/\[[\d.:]+\]/g, '')
    //       _this.setData({
    //         lyric
    //       })
    //     }
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  }
})