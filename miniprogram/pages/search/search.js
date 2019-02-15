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
		//调试api
		wx.request({
			url: 'http://shenkeling.top:3000/search?keywords=' + keyword,
			success: function(res) {
				console.log(res)
				if(res.data.result.songCount > 0){
					const songs = res.data.result.songs.map(song=>{
						return {
							id: song.id,
							name: song.name,
							album: song.album.name,
							artist: song.artists[0].name
						}
					})
					console.log(songs)
					_this.setData({songs})
				}else{
					wx.showToast({
						title: '出错啦',
						icon: 'none',
						image: '',
						duration:1000,
						mask: true,
						success: function(res) {},
						fail: function(res) {},
						complete: function(res) {},
					})
				}
			},
			fail: function(res) {
				console.error(res)
			},
			complete: function(res) {
				wx.hideLoading()
			},
		})
  }
})