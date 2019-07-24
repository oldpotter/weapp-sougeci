// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	try{
		return await db.collection('lyriclist').doc(event.ownerId).update({
			data:{
				collected: event.collectedId
			}
		})
	}catch(err){
		console.error(err)
	}
}