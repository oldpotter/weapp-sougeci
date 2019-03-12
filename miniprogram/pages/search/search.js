Page({
  data: {
    songs: [],
		src: 'https://shenkeling.top/files/1.jpeg'
  },

  doSearch(e) {
    const _this = this
    const keyword = e.detail.value.trim()
    if (keyword.length == 0) {
      return
    }
    wx.showLoading({})
    wx.cloud.callFunction({
      name: 'search',
      data: {
        keywords: keyword
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
          _this.setData({
            songs
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