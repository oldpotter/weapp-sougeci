// 添加歌词到歌单
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
	try {
		return await db.collection('lyriclist').doc(event.ownerId).update({
			data: {
				lyrics: _.push(event.lyrics)
			}
		})
	} catch (err) {
		console.error(err)
	}
}