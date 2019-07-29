const limit = 12
Page({
  data: {
    title: '', //新建歌单标题
    list: [],
    offset: 0,
    showPopup: false, //显示弹出层
    loading: false,
		tip: ''
  },

  onShow() {
		wx.startPullDownRefresh()
  },

	onPullDownRefresh(){
		const _this = this
		this.getList().then(res => {
			// console.log(res)
			_this.setData({
				list: res,
				offset: res.length,
				tip: res.length > 0 ? '' : '暂时没有数据'
			})
			wx.stopPullDownRefresh()
		})
	},

  onReachBottom() {
    // console.log('booott')
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
		const _ = db.command
    return new Promise((resolve, reject) => {
      if (skip != 0) {
        db.collection('lyriclist')
					.where(_.or([
						{ _openid: getApp().globalData.openid},
						{ collected: getApp().globalData.openid}
					]))
          .limit(limit)
          .skip(skip)
          .orderBy('createTime', 'desc')
          .get({
            success(res) {
              resolve(res.data)
            },
          })
      } else {
        db.collection('lyriclist')
					.where(_.or([
						{ _openid: getApp().globalData.openid },
						{ collected: getApp().globalData.openid }
					]))
          .limit(limit)
          .orderBy('createTime', 'desc')
          .get({
            success(res) {
              resolve(res.data)
            },
          })
      }
    })
  },

  onTapAdd(e) {
    this.setData({
      showPopup: true
    })
  },

  onClosePopup() {
    this.setData({
      showPopup: false
    })
  },

  onTapCell(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './edit?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onTitleChange(e) {
    this.setData({
      title: e.detail
    })
  },

  onTapOK() {
    this.setData({
      loading: true
    })
    //在服务器新建歌单
    const _this = this
    const db = getApp().globalData.db
    db.collection('lyriclist').add({
      data: {
        title: _this.data.title,
        createTime: db.serverDate(),
				collected: null,
				lyrics: []
      },
      success(res) {
        if (res.errMsg == 'collection.add:ok') {
          _this.setData({
            showPopup: false
          })
					wx.startPullDownRefresh()
        }
        _this.setData({
          loading: false
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  }
})