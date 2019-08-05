const limit = 10 //一次加载的数量
// 在页面中定义插屏广告
let interstitialAd = null
let showAd = true
Page({
  data: {
    offset: 0,
    list: [],
    loading: false,
    tip: ''
  },

  onLoad() {
		getApp().globalData.refresh = true
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-36af2d060701e659'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
  },

  onShow() {
    if (getApp().globalData.refresh) {
      wx.startPullDownRefresh({
        success: function(res) {
					getApp().globalData.refresh = false
				},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },


  onPullDownRefresh() {
    const _this = this
    this.getList().then(res => {
      _this.setData({
        list: res,
        offset: res.length,
        tip: res.length > 0 ? '' : '暂时没有数据'
      })
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    const _this = this
    this.setData({
      loading: true
    })
    this.getList(this.data.offset).then(res => {
      let list = _this.data.list
      list = list.concat(res)
      _this.setData({
        list,
        loading: false,
        tip: res.length < limit ? '没有更多数据了' : '',
        offset: list.length
      })
			// 在适合的场景显示插屏广告
			if (showAd && interstitialAd) {
				showAd = false
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}
    })
  },

  getList(skip = 0) {
    //获取歌词列表
    const _this = this
    const db = getApp().globalData.db
    return new Promise((resolve, reject) => {
      if (skip != 0) {
        db.collection('lyrics')
          .where({
            _openid: getApp().globalData.openid
          })
          .limit(limit)
          .skip(skip)
          .orderBy('date', 'desc')
          .get({
            success(res) {
              resolve(res.data)
            },
          })
      } else {
        db.collection('lyrics')
          .where({
            _openid: getApp().globalData.openid
          })
          .limit(limit)
          .orderBy('date', 'desc')
          .get({
            success(res) {
              resolve(res.data)
            },
          })
      }
    })
  }
})