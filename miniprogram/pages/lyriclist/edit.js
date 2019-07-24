import Toast from '../../components/vant/toast/toast'
Page({
  data: {
    _id: null, //歌单id
    title: null, //歌单标题
    desc: null, //歌单描述
    loading: false,
    list: [],
    owner: null, //歌单创建者的openid,
    openid: null //用户的openid,
  },

  onLoad(e) {
    // console.log('onload:', e)
    this.setData({
      _id: e.id
    })
  },

  onShareAppMessage() {
    const _this = this
    return {
      path: `/pages/lyriclist/edit?id=${_this.data._id}`
    }
  },

  onShow() {
    if (this.data._id != null) {
      //查询歌单内容
      const _this = this
      const db = getApp().globalData.db
      const _ = db.command
      db.collection('lyriclist').doc(_this.data._id).get({
        success(res) {

          _this.setData({
            title: res.data.title,
            desc: res.data.desc,
            owner: res.data._openid
          })
          // console.log(`歌单创建者：${_this.data.owner}, 当前用户：${_this.data.openid}`)
          if (res.data.lyrics) {
            db.collection('lyrics').where({
              _id: _.in(res.data.lyrics)
            }).get({
              success(res) {
                // console.log(res)
                _this.setData({
                  list: res.data,
                  offset: res.length,
                  tip: res.length > 0 ? '' : '暂时没有数据'
                })
              }
            })
          }

        }
      })

    }
  },

  onReady() {
    this.setData({
      openid: getApp().globalData.openid
    })

  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  onTapAddLyric() {
    //跳转到所有收藏的歌词列表
    const _this = this
    wx.navigateTo({
      url: './collect?id=' + _this.data._id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onTapDelete() {
    db.collection('lyriclist').doc(this.data._id).remove({
      success() {
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: console.error
    })
  },

	//收藏歌单
  onTapCollect() {
    const _this = this
    // console.log(`_id:${this.data._id}, openid:${getApp().globalData.openid}`)
		wx.cloud.callFunction({
			name: 'collectLyricList',
			data: {
				ownerId: _this.data._id,
				collectedId: getApp().globalData.openid
			},
			success(res){
				if (res.errMsg == 'cloud.callFunction:ok'){
					Toast.success('收藏成功');
				}
			},
			fail(err){
				console.error(err)
			}
		})
  }
})