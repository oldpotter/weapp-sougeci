const limit = 10 //一次加载的数量
Page({
  data: {
    offset: 0,
    list: [],
    loading: false,
    tip: ''
  },

  onShow() {
		// console.log(`debug: ${getApp().globalData.debug}`)
    const _this = this
    this.getList().then(res => {
      _this.setData({
        list: res,
        offset: res.length,
				tip: res.length > 0 ? '':'暂时没有数据'
      })
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
    })
  },

  getList(skip = 0) {
    //获取歌词列表
    const _this = this
    const db = getApp().globalData.db
    return new Promise((resolve, reject) => {
      if (skip != 0) {
        db.collection('lyrics')
					.where({ _openid: getApp().globalData.openid })
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
					.where({ _openid: getApp().globalData.openid })
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