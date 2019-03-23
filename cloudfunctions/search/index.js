// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
	const keywords = encodeURI(event.keywords)
	const limit = event.limit
	const offset = event.offset
	const url = `http://shenkeling.top:3000/search?keywords=${keywords}&limit=${limit}&offset=${offset}`  
	request(url, (err, res, body) => {
		resolve(body)
	})
})