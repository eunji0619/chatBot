const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockSchema = new Schema({
  name: String,
  time: String,
  stock: String
})

module.exports = mongoose.model('Stock', StockSchema)
// module.exports = mongoose.model('Photo', PhotoSchema, 'Photo')
// 'Photo'가 'Photos'로 바뀌는 것을 막는다.
