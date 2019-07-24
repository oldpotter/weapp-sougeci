const limit = 15 //一次加载的数量
Page({
	data: {
		_id: null,//歌单id
		list: [],
		result: []
	},

	onLoad(e){
		this.setData({_id: e.id})
		const _this = this
		this.getList().then(res => {
			_this.setData({
				list: res,
				offset: res.length,
				tip: res.length > 0 ? '' : '暂时没有数据'
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
					.limit(limit)
					.orderBy('date', 'desc')
					.get({
						success(res) {
							resolve(res.data)
						},
					})
			}
		})
	},

	onChange(event) {
		this.setData({
			result: event.detail
		});
	},

  toggle(event) {
		const { id } = event.currentTarget.dataset;
		const checkbox = this.selectComponent(`.checkboxes-${id}`);
		checkbox.toggle();
	},

	noop() { },

	onClickOK(){
		//添加歌词到歌单
		const _this = this
		const db = getApp().globalData.db
		const _ = db.command
		db.collection('lyriclist').doc(this.data._id).update({
			// data 传入需要局部更新的数据
			data: {
				// 表示将 done 字段置为 true
				lyrics: _.push(_this.data.result)
			},
			success(){
				wx.navigateBack({
					delta: 1,
				})
			},
			fail: console.error
		})
	}
})