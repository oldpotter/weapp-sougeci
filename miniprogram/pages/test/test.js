Page({
  b1(e) {
    console.log('1:', e)
		const _this = this
		const path = e.detail.tempFilePaths[0]
		wx.cloud.uploadFile({
			cloudPath: '1.png',
			filePath: path,
			success(res) {
				if (res.statusCode == 200) {
					//上传成功
					_this.setData({
						imageUrl1: res.fileID,
						uploading: false
					})
					console.log('fileId：', res)
				}
			},
			fail: console.error
		})
  },
  b2(e) {
		console.log('2:', e)
		const _this = this
		const path = e.detail.tempFilePaths[0]
		wx.cloud.uploadFile({
			cloudPath: '2.png',
			filePath: path,
			success(res) {
				if (res.statusCode == 200) {
					//上传成功
					_this.setData({
						imageUrl2: res.fileID,
						uploading: false
					})
					console.log('fileId：', res)
				}
			},
			fail: console.error
		})
  },
  b3(e) {
		console.log('3:', e)
		const _this = this
		const path = e.detail.tempFilePaths[0]
		wx.cloud.uploadFile({
			cloudPath: '3.png',
			filePath: path,
			success(res) {
				if (res.statusCode == 200) {
					//上传成功
					_this.setData({
						imageUrl3: res.fileID,
						uploading: false
					})
					console.log('fileId：', res)
				}
			},
			fail: console.error
		})
  },
})