Page({
	onReady(){
		const db = getApp().globalData.db
		const _ = db.command
		db.collection('lyriclist')
			.where({
				collected: _.in(['o2Xr00B5XdvII4iyWHdfxxT65Hac'])
			})
			.orderBy('createTime', 'desc')
			.get({
				success(res) {
					console.log(res)
				},
			})

	}
})