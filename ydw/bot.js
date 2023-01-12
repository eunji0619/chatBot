require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const request = require('request')
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser')
// xml을 JSON으로 변환
const parser = new XMLParser()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.botid

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })
let trans_status = false
// 영번역 off 상태

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id
  const resp = match[1] // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp)
})

// Listen for any kind of message. There are different kinds of
// messages.

let api_url = 'https://openapi.naver.com/v1/papago/n2mt'
let client_id = process.env.papago_id
let client_secret = process.env.papago_secret
// 파파고 api id와 secret

bot.on('message', (msg) => {
  // console.log(msg)
  const chatId = msg.chat.id
  // console.log(chatId)

  // 번역 시작
  if (msg.text === '번역 Let go') {
    trans_status = true
  }
  // 영번 시작 명령어
  if (msg.text === 'Let 한글사랑') {
    trans_status = false
  }
  // 영번 끝 명령어

  if (trans_status) {
    let options = {
      url: api_url,
      form: { source: 'ko', target: 'en', text: msg.text },
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
      }
    }
    request.post(options, function (error, response, body) {
      console.log(options)
      if (!error && response.statusCode == 200) {
        const rst = JSON.parse(body)
        console.log(rst)
        bot.sendMessage(chatId, rst.message.result.translatedText)
      } else {
        console.log('error = ' + response.statusCode)
      }
    })
  }
  // 번역 끝

  if (msg.caption) {
    console.log(msg.document.file_id)
  }

  // send a message to the chat acknowledging receipt of their message
  if (msg.text === '??') {
    bot.sendMessage(chatId, '??')
  }
})

setInterval(() => {
  const date = new Date()
  const alram = date.getHours() + ':' + date.getMinutes()
  if (alram == '9:10') {
    const url =
      'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'
    let ER
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        ER = data[0].basePrice
        console.log(ER)
        bot.sendMessage(
          -1001868932998,
          `현재 달러 환율은 달러 당 ${ER}원입니다.`
        )
      })
  }
  if (alram == '12:55') {
    const date = new Date()
    const key = process.env.pkey
    const url =
      'http://apis.data.go.kr/6260000/AirQualityInfoService/getAirQualityInfoClassifiedByStation?serviceKey=' +
      key +
      '&pageNo=1&numOfRows=20&resultType=json'
    request(url, (e, res, body) => {
      const rst = JSON.parse(body)
      const pm25 =
        rst.getAirQualityInfoClassifiedByStation.body.items.item[2].pm25
      const pm10 =
        rst.getAirQualityInfoClassifiedByStation.body.items.item[2].pm10
      bot.sendMessage(
        -1001868932998,
        `현재 전포동의 미세먼지 수치는 ${pm25}이며 초미세먼지 수치는${pm10}입니다.`
      )
    })
  }
}, 1 * 5000)

// fetch(url)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data)
// ER = data[0].basePrice
// console.log(ER)
// bot.sendMessage(
//   -1001868932998,
//   `현재 달러 환율은 달러 당 ${ER}원입니다.`
// )
// })
