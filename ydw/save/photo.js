const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PhotoSchema = new Schema({
  albumId: Number,
  id: Number,
  title: String,
  url: String,
  thumbnailUrl: String
})

module.exports = mongoose.model('Photo', PhotoSchema)
// module.exports = mongoose.model('Photo', PhotoSchema, 'Photo')
// 'Photo'가 'Photos'로 바뀌는 것을 막는다.
