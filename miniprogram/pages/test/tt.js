Page({
	onLoad(e){
		console.log('tt page onload:', e)
	},

	onShareAppMessage(){
		const iidd = 99887766
		return {
			title: 'NEW PAGE',
			path: '/pages/test/new?iidd' + iidd
		}
	}
})