// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
	const url = 'http://shenkeling.top:3000/search?keywords=' + encodeURI(event.keywords)
	request(url, (err, res, body) => {
		resolve(body)
	})
})