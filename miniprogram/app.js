//app.js
const config = require('./config.js')
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
				env: config.debug ? 'dev-904dcd' : 'prod-904dcd'
      })
    }

    this.globalData = {
			db: wx.cloud.database()
		}
  }
})
