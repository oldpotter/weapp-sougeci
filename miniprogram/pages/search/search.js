Page({
  data: {
    songs: []
  },

  doSearch(e) {
    const _this = this
    const keyword = e.detail.value.trim()
    if (keyword.length == 0) {
      return
    }
    wx.showLoading({
      title: '',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
  }
})