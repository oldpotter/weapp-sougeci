Page({
	onLoad(){
		const url = 'http://192.168.31.99:5000/lyric/pushlyric'
		wx.request({
			url: url,
			data: {
				lyric: '哪些花儿说'
			},
			header: {},
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				console.log('成功了', res)
			},
			fail: function(res) {
				console.error(res)
			},
			complete: function(res) {},
		})
	}
})