Page({
	c(){
		this.setData({
			imageUrl: null
		})
		wx.showLoading({
			title: '111111',
			mask: true,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
		const _this = this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				// tempFilePath可以作为img标签的src属性显示图片
				const tempFilePaths = res.tempFilePaths
				// console.log(tempFilePaths[0])
				wx.cloud.uploadFile({
					cloudPath: '1.jpg',
					filePath: tempFilePaths[0],
					success(res){
						// console.log(res)
						wx.cloud.getTempFileURL({
							fileList: [{
								fileID: res.fileID,
								maxAge: 10 * 1,
							}],
							success(res){
								console.log(res.fileList[0].tempFileURL)
								_this.setData({
									imageUrl: res.fileList[0].tempFileURL
								})
								wx.hideLoading()
							}
						})
					}
				})
			}
		})
	}
})