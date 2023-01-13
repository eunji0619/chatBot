const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatBot = new Schema({
  key: String, //아이유
  text: String, //아이유 이쁘다
  url: String, //링크
  imageId: String //이미지 id 값
})

module.exports = mongoose.model('chatBot', chatBot)
