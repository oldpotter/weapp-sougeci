//app.js
const config = require('./config.js')
App({
  onLaunch: function () {
		const _this = this
		
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
				env: config.debug ? 'dev-904dcd' : 'prod-904dcd'
      })
    }

    this.globalData = {
			db: wx.cloud.database(),
			fontSize: 10,
			openid: null,
			refresh: false
		}
		
		//获取当前用户的Openid
		const db = this.globalData.db
		db.collection('openid').get({
			success(res){
				if(res.data.length==0){
					db.collection('openid').add({
						data: {
							visitDate: db.serverDate()
						},
						success(res){
							db.collection('openid').get({
								success(res){
									if(res.data.length>0){
										_this.globalData.openid = res.data[0]._openid
									}
								}
							})
						}
					})
				}else{
					_this.globalData.openid = res.data[0]._openid
				}
			}
		})

		wx.getSystemInfo({
			success: function(res) {
				// console.log(res)
				_this.globalData.fontSize = res.fontSizeSetting
			},
		})
  },

	onShow(e){
		//获取当前进入小程序的场景值
		const scene = wx.getLaunchOptionsSync().scene
		this.globalData.scene = scene
		// console.log(this.globalData.scene)
	}
	
})
