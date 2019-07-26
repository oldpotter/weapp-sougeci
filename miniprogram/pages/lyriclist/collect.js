const limit = 15 //一次加载的数量
const db = getApp().globalData.db
const _ = db.command
Page({
	data: {
		_id: null,//歌单id
		list: [],
		result: [],
		adding: false
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
		// const db = getApp().globalData.db
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
	},

	//选择变动
	onChange(event) {
		// console.log(event)
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
		this.setData({adding: true})
		// console.log(this.data.result)
		//添加歌词到歌单(调用callFunction)
		const _this = this
		wx.cloud.callFunction({
			name: 'addLyricToList',
			data:{
				ownerId: _this.data._id,
				lyrics: _this.data.result 
			},
			success(res){
				if(res.result.stats.updated == 1){
					wx.navigateBack({
						delta: 1,
					})
				}
			}
		})
	}
})