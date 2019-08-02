import Toast from '../../components/vant/toast/toast'
import Notify from '../../components/vant/notify/notify'
const db = getApp().globalData.db
const _ = db.command
const dayjs = require('dayjs')
const limit = 15 //一次加载的数量
Page({
  data: {
    _id: null, //歌单id
    title: undefined, //歌单标题
    desc: undefined, //歌单描述
    loading: false, //修改标题信息
    list: [],
    owner: null, //歌单创建者的openid,
    openid: null, //用户的openid,
    showPopup: false, //是否显示弹出层
    imageUrl: null, //封面
    uploading: false //上传封面
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
      title: '歌单标题：' + _this.data.title,
      path: `/pages/lyriclist/edit?id=${_this.data._id}`,
      imageUrl: _this.data.imageUrl
    }
  },

  onReady() {
    this.setData({
      openid: getApp().globalData.openid
    })
		Notify('左划单元格删除已添加的歌词')
		wx.startPullDownRefresh({
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
  },

	onShow(){
		if(getApp().globalData.refresh){
			wx.startPullDownRefresh({
				success: function(res) {
					getApp().globalData.refresh = false
				},
				fail: function(res) {},
				complete: function(res) {},
			})
		}
	},

  onReachBottom() {
    const _this = this
    this.setData({
      getting: true
    })
    db.collection('lyrics').where({
        _id: _.in(_this.data.lyrics)
      })
      .limit(limit)
      .skip(_this.data.offset)
      .get({
        success(res) {
          let list = _this.data.list
          list = list.concat(res.data)
          _this.setData({
            list,
            getting: false,
            tip: res.data.length < limit ? '没有更多数据了' : '',
            offset: list.length
          })
        }
      })
  },

  onPullDownRefresh() {
		if (this.data._id != null) {
			//查询歌单内容
			const _this = this
			db.collection('lyriclist').doc(_this.data._id).get({
				success(res) {
					// console.log(res)
					_this.setData({
						title: res.data.title,
						desc: res.data.desc,
						owner: res.data._openid,
						imageUrl: null
					})
					if (res.data.pic) {

						//换取真是地址
						wx.cloud.getTempFileURL({
							fileList: [{
								fileID: res.data.pic,
								// maxAge: 1
							}],
							success(res) {
								// console.log(res)
								if (res.errMsg == 'cloud.getTempFileURL:ok') {
									_this.setData({
										imageUrl: res.fileList[0].tempFileURL + '?&t=' + dayjs().unix()
									})
									// console.log('address:', _this.data.imageUrl)
								}

							}
						})
					}
					if (res.data.lyrics) {
						_this.setData({
							lyrics: res.data.lyrics
						})
						db.collection('lyrics').where({
							_id: _.in(res.data.lyrics)
						})
							.limit(limit)
							.get({
								success(res) {
									// console.log(res)
									_this.setData({
										list: res.data,
										offset: res.data.length,
										tip: res.data.length > 0 ? '' : '暂时没有数据'
									})
									// console.log('offset:', _this.data.offset)
								},
								complete(){
									wx.stopPullDownRefresh()
								}
							})
					}
				}
			})
		}
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

  //删除歌词
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
  },


  //选择了图片
  onBefore(e) {
    // console.log('onBefore:', e)
    this.setData({
      imageUrl: null,
      uploading: true
    })
    const _this = this
    const path = e.detail.tempFilePaths[0]
    // console.log(path)
    wx.cloud.uploadFile({
      cloudPath: _this.data.title + '.jpg',
      filePath: path,
      success(res) {
        if (res.statusCode == 200) {
          // console.log('upload:', res)
          //修改歌单封面
          db.collection('lyriclist').doc(_this.data._id).update({
            data: {
              pic: res.fileID
            },
            success(res) {
              if (res.stats.updated == 1) {
                // console.log('更换封面成功')
              }
							
            }
          })

					/*
					//换取真是地址
					wx.cloud.getTempFileURL({
						fileList: [{
							fileID: res.fileID,
							maxAge: 1 * 1
						}],
						success(res) {
							console.log('res:', res)
							if (res.errMsg == 'cloud.getTempFileURL:ok') {
								_this.setData({
									uploading: false,
									imageUrl: res.fileList[0].tempFileURL
								})
							}
						},
						fail: console.error,
					})*/
        }
      },
      fail: console.error
    })
  },


  onRemove(e) {
    // const { file, fileList } = e.detail
    // wx.showModal({
    // 	content: '确定删除？',
    // 	success: (res) => {
    // 		if (res.confirm) {
    // 			this.setData({
    // 				fileList: fileList.filter((n) => n.uid !== file.uid),
    // 			})
    // 		}
    // 	},
    // })
  },

})