import Toast from '../../components/vant/toast/toast'
import Notify from '../../components/vant/notify/notify'
const db = getApp().globalData.db
const _ = db.command
Page({
  data: {
    _id: null, //歌单id
    title: undefined, //歌单标题
    desc: undefined, //歌单描述
    loading: false,
    list: [],
    owner: null, //歌单创建者的openid,
    openid: null, //用户的openid,
    showPopup: false //是否显示弹出层
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
      db.collection('lyriclist').doc(_this.data._id).get({
        success(res) {
          // console.log(res)
          _this.setData({
            title: res.data.title,
            desc: res.data.desc,
            owner: res.data._openid
          })
          if (res.data.lyrics) {
            db.collection('lyrics').where({
              _id: _.in(res.data.lyrics)
            }).get({
              success(res) {
								// console.log(res)
                if (res.data.length > 0) {
                  Notify('左划单元格删除已添加的歌词')
                }
                
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
      success(res) {
        if (res.errMsg == 'cloud.callFunction:ok') {
          Toast.success('收藏成功');
        }
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  //编辑歌单信息
  onTapEdit() {
    this.setData({
      showPopup: true
    })
  },

  onClosePopup() {
    this.setData({
      showPopup: false
    })
  },

  onDescChange(e) {
    this.setData({
      desc: e.detail
    })
  },

  onTitleChange(e) {
    this.setData({
      title: e.detail
    })
  },
  //确认歌单修改
  onTapOK() {
    //修改标题和描述
    this.setData({
      loading: true
    })
    //在服务器新建歌单
    const _this = this
    // const db = getApp().globalData.db
    db.collection('lyriclist').doc(this.data._id).update({
      data: {
        title: _this.data.title,
        desc: _this.data.desc
      },
      success(res) {
        if (res.stats.updated == 1) {
          Toast.success('修改成功')
          _this.onClosePopup()
          _this.setData({
            loading: false
          })
        }
      }
    })
  },

  onCellClose(event) {
    const _this = this
    const {
      instance
    } = event.detail
    const index = event.currentTarget.dataset.index
    let list = this.data.list
    list.splice(index, 1)

    // console.log(list)
    //删除歌词
    db.collection('lyriclist').doc(this.data._id).update({
      data: {
        lyrics: list
      },
      success(res) {
        if (res.stats.updated == 1) {
          _this.setData({
            list
          })
          instance.close()
          Toast.success('删除成功')
        }
      }
    })
  }
})