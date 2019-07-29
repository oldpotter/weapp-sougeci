// 添加歌词到歌单
const cloud = require('wx-server-sdk')
cloud.init({
	env: 'prod-904dcd'
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  try {
    return await db.collection('lyriclist').doc(event.id)
      .update({
        data: {
          lyrics: _.push(event.lyrics)
        }
      })
  } catch (err) {
    console.error(err)
  }
}