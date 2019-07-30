Page({
	onReady(){
		console.log('onReady')
		wx.cloud.callFunction({
			name: 'test',
			data:{
				keywords: '朴树'
			},
			success: console.log,
			fail: console.error
		})
	}
})