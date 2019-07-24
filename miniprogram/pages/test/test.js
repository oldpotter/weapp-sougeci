Page({
	data:{
		id: '9afd9b6a5d2e9f2c0934c61670cdc319'
	},

	onReady(){
		this.u()
	},

	u(){
		//9afd9b6a5d2e9f2c0934c61670cdc319
		const openid = getApp().globalData.openid
		const db = getApp().globalData.db
		const id = this.data.id
		const _this = this
		console.log('id:', id)
		console.l
		db.collection('lyriclist').doc(this.data.id).update({
			data: {
				collected: getApp().globalData.openid
			},
			success(res) {
				console.log('收藏成功：', res)
			},
			fail(err) {
				console.error('收藏失败:', err)
			}
		})
	}
})