require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const parser = new XMLParser();

const token = process.env.botid;

const bot = new TelegramBot(token, { polling: true });
let trans_status = false;
// 영번역 off 상태

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

//                                                          @@ 봇으로 저장 시작 @@
bot.onText(/\/save (.+)/, (msg, match) => {
  console.log(match);
  const chatId = msg.chat.id;
  let words, command, text, url, imageId;

  words = match[1].split(" ");
  console.log(words);
  command = words[0];
  imageId = "";

  if (words[1].includes("https://")) {
    url = words[1];
    text = "";
  } else {
    text = words[1];
    url = "";
  }

  const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
  const saveM = async () => {
    const _data = {
      key: command, //휘인
      text: text, //휘인 대 존예
      url: url, //링크
      imageId: imageId, //이미지
    };
    console.log(_data);
    const new_chatBot = new chatBot(_data);
    const t = await new_chatBot.save();
    console.log(t);
  };
  saveM();

  // const updateM = async (command) => {
  //   const t = await chatBot
  //     .updateMany(
  //       {
  //         key: { $eq: command }
  //       },
  //       {
  //         // $set: { "url": "http://daum.net" }
  //         $set: {
  //           text: text,
  //           url: url,
  //           albumId: albumId
  //         }
  //       },
  //       {
  //         upsert: true,
  //         multi: true,
  //         new: true
  //       }
  //     )
  //     .lean()
  //   console.log(t)
  // }
  // updateM()
});
//                                                            @@ 봇으로 저장 끝 @@

//                                                    @@ onText로 번역하기 시작 @@
bot.onText(/\/translate (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const trans = msg.text;

  const NAVER_CLIENT_ID = process.env.papago_id;
  const NAVER_CLIENT_SECRET = process.env.papago_secret;

  let api_url = "https://openapi.naver.com/v1/papago/n2mt";

  const request = require("request");
  require("dotenv").config();

  let options = {
    url: api_url,
    form: { source: "ko", target: "en", text: trans },
    headers: {
      "X-Naver-Client-Id": NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      const rst = JSON.parse(body);
      let match = rst.message.result.translatedText;

      bot.sendMessage(chatId, match);
    } else {
      console.log("error = " + response.statusCode);
    }
  });
});
//                                                      @@ onText로 번역하기 끝 @@

let api_url = "https://openapi.naver.com/v1/papago/n2mt";
let client_id = process.env.papago_id;
let client_secret = process.env.papago_secret;
// 파파고 api id와 secret

//                                                               @@ bot.on 시작 @@
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  // console.log(msg)
  const caption = msg.caption;
  // const file_id = msg.document.file_id

  //                                                 @@ '저장해'로 저장하기 시작 @@
  let words, command, keyword, text, url, imageId;
  words = msg.text.split(" ");
  command = words[0];

  if (command == "저장해") {
    keyword = words[1];
    imageId = "";
    if (words[2].includes("https://")) {
      url = words[2];
      text = "";
    } else {
      text = words[2];
      url = "";
    }
    let words_loaded;
    const findM = async (word) => {
      const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
      const t = await chatBot
        .find({
          key: { $eq: word },
        })
        .lean();
      // console.log(t)
      words_loaded = t[0];
      console.log(words_loaded);
    };
    findM(keyword).then((keyword) => {
      if ((keyword = words_loaded.key)) {
        if (words_loaded.text) {
          const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
          const main = async () => {
            const t = await chatBot
              .updateMany(
                {
                  key: {
                    $eq: keyword,
                  },
                },
                {
                  $set: {
                    text: text,
                  },
                },
                {
                  upsert: true,
                  multi: true,
                  new: true,
                }
              )
              .lean();
          };
          main();
        }
        if (words_loaded.url) {
          const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
          const main = async () => {
            const t = await chatBot
              .updateMany(
                {
                  key: {
                    $eq: keyword,
                  },
                },
                {
                  $set: {
                    url: url,
                  },
                },
                {
                  upsert: true,
                  multi: true,
                  new: true,
                }
              )
              .lean();
          };
          main();
        }
        if (words_loaded.imageId) {
          const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
          const main = async () => {
            const t = await chatBot
              .updateMany(
                {
                  key: {
                    $eq: keyword,
                  },
                },
                {
                  $set: {
                    imageId: imageId,
                  },
                },
                {
                  upsert: true,
                  multi: true,
                  new: true,
                }
              )
              .lean();
          };
          main();
        }
      } else {
        const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
        const saveM = async () => {
          const _data = {
            key: keyword,
            text: text,
            url: url,
            imageId: imageId,
          };
          // console.log(_data)
          const new_chatBot = new chatBot(_data);
          const t = await new_chatBot.save();
          console.log(t);
        };
        saveM();
      }
    });
  }
  //                                                   @@ '저장해'로 저장하기 끝 @@

  //                                                     @@ DB에서 불러오기 시작 @@
  const findM = async (command) => {
    const { mongoose, chatBot } = require("./DB_CRUD_chatBot.js");
    const t = await chatBot
      .find({
        key: { $eq: command },
      })
      .lean();

    if (t.length > 0) {
      if (t[0].text) {
        bot.sendMessage(chatId, t[0].text);
      }
      if (t[0].albumId) {
        bot.sendPhoto(chatId, t[0].albumId);
      }
      if (t[0].url) {
        bot.sendMessage(chatId, t[0].url);
      }
    }
  };
  findM(msg.text);
  //                                                      @@ DB에서 불러오기 끝 @@

  //                                                               @@ 번역 시작 @@
  if (msg.text === "번역 Let go") {
    trans_status = true;
  }
  // 영번 시작 명령어
  if (msg.text === "Let 한글사랑") {
    trans_status = false;
  }
  // 영번 끝 명령어

  if (trans_status) {
    let options = {
      url: api_url,
      form: { source: "ko", target: "en", text: msg.text },
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    };
    request.post(options, function (error, response, body) {
      console.log(options);
      if (!error && response.statusCode == 200) {
        const rst = JSON.parse(body);
        bot.sendMessage(chatId, rst.message.result.translatedText);
      } else {
        console.log("error = " + response.statusCode);
      }
    });
  }
  //                                                                 @@ 번역 끝 @@

  //                                                               @@ 로또 시작 @@
  if (msg.text == "로또") {
    const axios = require("axios"); //리퀘스트용도로 사용
    const cheerio = require("cheerio"); //선택자로 필요한 정보만 추출

    const url =
      "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%A1%9C%EB%98%90+%EC%A0%80%EB%B2%88%EC%A3%BC+%EB%8B%B9%EC%B2%A8+%EB%B2%88%ED%98%B8";

    let lotto = [];
    let bonus;

    axios.get(url).then((res) => {
      let $ = cheerio.load(res.data);

      $(".winning_number>span").each(function () {
        lotto.push($(this).text());
      });

      bonus = $(".bonus_number>span").text();

      const A = Math.floor(Math.random() * 45) + 1;
      const B = Math.floor(Math.random() * 45) + 1;

      if (A !== B) {
        bot.sendMessage(
          chatId,
          `지난 주 당첨 번호는 [${lotto}], 보너스 번호는 ${bonus}입니다. 이번 주 추천 번호는 ${A}와 ${B} 입니다.`
        );
      } else {
        return;
      }
    });
  }
  //                                                                 @@ 로또 끝 @@

  //                                                       @@ 식단 불러오기 시작 @@
  if (msg.text == "식단") {
    const axios = require("axios"); //리퀘스트용도로 사용
    const cheerio = require("cheerio"); //선택자로 필요한 정보만 추출

    const url =
      "https://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN202";

    let menu = [],
      day = [],
      date = [];

    axios.get(url).then((res) => {
      let $ = cheerio.load(res.data);
      $(".day").each(function () {
        day.push($(this).text());
      });
      $(".date").each(function () {
        date.push($(this).text());
      });

      let today = new Date();
      let days = today.getDay();

      for (i = 0; i <= 6; i++) {
        if (days - 1 == i) {
          $("tbody")
            .children("tr:eq(1)")
            .children(`td:eq(${i})`)
            .each(function () {
              menu.push($(this).text());
            });
          bot.sendMessage(chatId, `오늘의 메뉴는 [${menu}] 입니다.`);
        }
      }
    });
  }
  //                                                         @@ 식단 불러오기 끝 @@

  //                                        @@ 삼성전자 주식 데이터 불러오기 시작 @@
  if (msg.text == "삼성전자") {
    let stock_record_time = [];
    let stock_record_price = [];
    const { mongoose, Stock } = require("./DB_CRUD_stock.js");
    const main = async () => {
      const t = await Stock.find({
        name: "삼성전자",
      }).lean();
      if (t.length < 10) {
        for (let i = 0; i < t.length; i++) {
          stock_record_time.push(t[i].time);
          stock_record_price.push(t[i].stock);
        }
      } else {
        for (let j = t.length - 10; j < t.length; j++) {
          stock_record_time.push(t[j].time);
          stock_record_price.push(t[j].stock);
        }
      }
      console.log(stock_record_time);
      console.log(stock_record_price);
      bot.sendMessage(chatId, `${stock_record_price}`);
    };
    main();
    //                                        @@ 삼성전자 주식 데이터 불러오기 끝 @@
  }
});
//                                                                   @@ bot.on @@

//                                                          @@ setInterval 시작 @@
setInterval(() => {
  const date = new Date();
  const alram = date.getHours() + ":" + date.getMinutes();
  if (alram == "9:10") {
    const url =
      "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD";
    let ER;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        ER = data[0].basePrice;
        console.log(ER);
        bot.sendMessage(
          -1001868932998,
          `현재 달러 환율은 달러 당 ${ER}원입니다.`
        );
      });
  }
  if (alram == "12:55") {
    const date = new Date();
    const key = process.env.pkey;
    const url =
      "http://apis.data.go.kr/6260000/AirQualityInfoService/getAirQualityInfoClassifiedByStation?serviceKey=" +
      key +
      "&pageNo=1&numOfRows=20&resultType=json";
    request(url, (e, res, body) => {
      const rst = JSON.parse(body);
      const pm25 =
        rst.getAirQualityInfoClassifiedByStation.body.items.item[2].pm25;
      const pm10 =
        rst.getAirQualityInfoClassifiedByStation.body.items.item[2].pm10;
      bot.sendMessage(
        -1001868932998,
        `현재 전포동의 미세먼지 수치는 ${pm25}이며 초미세먼지 수치는${pm10}입니다.`
      );
    });
  }
  if (alram == "17:55") {
    const key = process.env.pkey;
    const bstopid = "505860000";
    const lineid = "5200052000";
    const url =
      "http://apis.data.go.kr/6260000/BusanBIMS/busStopArrByBstopidLineid?bstopid=" +
      bstopid +
      "&lineid=" +
      lineid +
      "&serviceKey=" +
      key;
    request(url, (e, res, body) => {
      const rst = parser.parse(body);
      console.log(rst.response.body.items.item);
      const remaining_arrival_time = rst.response.body.items.item.min1;
      const number_of_stops = rst.response.body.items.item.station1;
      bot.sendMessage(
        -1001868932998,
        `현재 서면.서면지하상가 버스 정류장에 도착하는 52번 버스는 현재 ${number_of_stops}개의 전 정류장에 위치하고 있으며 약 ${remaining_arrival_time}분 후에 도착 예정입니다.`
      );
    });
  }
}, 1 * 5000);
//                                                            @@ setInterval 끝 @@

//                                               @@ 삼성전자 주식 데이터 쌓기 시작 @@
setInterval(() => {
  const axios = require("axios"); //리퀘스트용도로 사용
  const cheerio = require("cheerio"); //선택자로 필요한 정보만 추출

  const url = "https://finance.naver.com/item/main.nhn?code=005930";

  let today = new Date();
  let today_present =
    today.getFullYear() +
    (today.getMonth() < 9
      ? "0" + (today.getMonth() + 1)
      : today.getMonth() + 1) +
    (today.getDay() < 10 ? "0" + today.getDay() : today.getDay()) +
    (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
  let today_stock = [];

  axios.get(url).then((res) => {
    let $ = cheerio.load(res.data);

    $(".no_today > .no_up > span").each(function () {
      today_stock.push($(this).text());
    });
    const { mongoose, Stock } = require("./DB_CRUD_stock.js");
    const main = async () => {
      const _data = {
        name: "삼성전자",
        time: today_present,
        stock: today_stock[0],
      };
      const new_stock = new Stock(_data);
      const t = await new_stock.save();
      console.log(t);
    };
    main();
  });
}, 3600000);
//                                                 @@ 삼성전자 주식 데이터 쌓기 끝 @@
