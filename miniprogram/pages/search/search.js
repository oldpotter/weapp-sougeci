const limit = 10;
Page({
  data: {
    songs: [],
		src: 'https://shenkeling.top/files/1.jpeg',
		offset: 0,
		tip: '',
		loadig: false
  },

	onReachBottom(){
		const _this = this
		this.setData({
			loading: true
		})
		wx.cloud.callFunction({
			name: 'search',
			data: {
				keywords: _this.data.keyword,
				limit,
				offset: _this.data.offset
			},
			success(res) {
				res = JSON.parse(res.result)
				if (res.result.songCount > 0) {
					let songs = res.result.songs.map(song => {
						return {
							id: song.id,
							name: song.name,
							album: song.album.name,
							artist: song.artists[0].name
						}
					})
					const offset = _this.data.offset + songs.length
					songs = _this.data.songs.concat(songs)
					_this.setData({
						songs,
						loading: false,
						offset
					})
				} else {
					_this.setData({
						loading: false,
						tip: '无更多数据'
					})
				}
				wx.hideLoading()
			},

			fail(err) {
				console.error(err)
			}
		})
	},

  doSearch(e) {
    const _this = this
    const keyword = e.detail.value.trim()
    if (keyword.length == 0) {
      return
    }
    wx.showLoading({})
		this.setData({
			offset: 0,
			keyword
		})
    wx.cloud.callFunction({
      name: 'search',
      data: {
        keywords: keyword,
				limit,
				offset: _this.data.offset
      },
      success(res) {
        res = JSON.parse(res.result)
        if (res.result.songCount > 0) {
          const songs = res.result.songs.map(song => {
            return {
              id: song.id,
              name: song.name,
              album: song.album.name,
              artist: song.artists[0].name
            }
          })
					const offset = _this.data.offset + songs.length
          _this.setData({
            songs,
						offset
          })
        } else {
          _this.setData({
            songs: []
          })
        }
        wx.hideLoading()
      },

      fail(err) {
        console.error(err)
      }
    })
		const db = getApp().globalData.db
		db.collection('logs').add({
			data: {
				keyword,
				date: db.serverDate()
			},
		})
  },

	save(){
		const _this = this
		wx.downloadFile({
			url: _this.data.src,
			header: {},
			success: function(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: function(res) {
						wx.showToast({
							title: '保存成功',
							duration: 1000
						})
					},
				})
			},
			fail: function(res) {},
			complete: function(res) {},
		})
	}
})