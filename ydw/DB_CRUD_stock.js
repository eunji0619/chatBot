require('dotenv').config()
const mongoose = require('mongoose')
const USER = process.env.telegrambotDBid
const PWD = process.env.telegrambotDBpw
const HOST = process.env.dbhost
const DB = 'TelegramBot'
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`
mongoose.set('strictQuery', false)
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err))
const Stock = require('./save/stock.js')
module.exports = { mongoose, Stock }
