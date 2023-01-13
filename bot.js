const { transformBind } = require("@vue/compiler-core");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.botid;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/translate (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const trans = msg.text;

  const NAVER_CLIENT_ID = process.env.ID;
  const NAVER_CLIENT_SECRET = process.env.SECRET;

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

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  //로또
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

  //식단
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

  //삼성전자 주식
  if (msg.text == "삼성전자") {
    const axios = require("axios"); //리퀘스트용도로 사용
    const cheerio = require("cheerio"); //선택자로 필요한 정보만 추출

    const url = "https://finance.naver.com/item/main.nhn?code=005930";

    let today_stock = [];
    let stock = [];

    axios.get(url).then((res) => {
      let $ = cheerio.load(res.data);

      $(".no_today > .no_up > span").each(function () {
        today_stock.push($(this).text());
      });

      stock.push(today_stock[0]);
      console.log(stock);

      let today = new Date();

      const date = today.toLocaleDateString("ko-kr");
      console.log(date);
      // const month = date.getMonth() + 1;
      // const day = date.getDate();

      bot.sendMessage(chatId, `${date}의 삼성전자 주식은 ${stock} 입니다.`);
    });
  }

  //영화순위
  if (msg.text == "영화순위") {
    const axios = require("axios"); //리퀘스트용도로 사용
    const cheerio = require("cheerio"); //선택자로 필요한 정보만 추출

    const url = "https://movie.naver.com/movie/sdb/rank/rmovie.naver";

    let movie = [];

    axios.get(url).then((res) => {
      let $ = cheerio.load(res.data);

      $(".tit3 > a").each(function () {
        movie.push($(this).text());
      });

      let movies = "";

      movie.forEach((v, i) => {
        if (i < 10) {
          movies += `${i + 1}위:${v}\n`;
        }
      });

      let today = new Date();
      const date = today.toLocaleDateString("ko-kr");

      bot.sendMessage(chatId, `${date} 영화순위 \n${movies}`);
    });
  }

  if (msg.text == "안녕하세요") {
    bot.sendMessage(chatId, "반갑습니다.");
  }

  if (msg.text == "로악귀") {
    let image =
      "https://upload3.inven.co.kr/upload/2021/12/10/bbs/i14015888077.png";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "반장님계단운동시간") {
    let image =
      "https://i.pinimg.com/originals/a0/29/2b/a0292b8b699accc1379057b37865c0ca.gif";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "강사님 이야기가 끝난 후 내 모습") {
    let image = "https://img.theqoo.net/img/vmUfq.jpg";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "잘한다") {
    let image = "https://img.theqoo.net/img/ofEaA.jpg";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "코딩하러 가자") {
    let image =
      "https://upload3.inven.co.kr/upload/2022/03/26/bbs/i15608172024.png?MW=360";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "집간다") {
    let image =
      "https://post-phinf.pstatic.net/MjAyMDAzMTdfNDQg/MDAxNTg0NDEwMjkxNTE5.TZTfSedKEwlvuinriffdlbli6dIPIVCy0yKNxoGtgWUg.MoqN0ZwKBIkEP4X0sZhaygsX6PDbhiYPT-IS6ZrFYuog.PNG/1.png?type=w1200";
    bot.sendMessage(chatId, image);
  }

  if (msg.text == "이시빈 전적") {
    let image =
      "https://img.lostark.co.kr/armory/9/4A97336897ABB060465CB3017AAC9BD320ED2358F4E4AC51EA64C20D48B0B706.png?v=20230108073204";

    let link = "https://loawa.com/char/%EB%8D%B0%EC%8A%A4%EB%85%B8%ED%8A%B821";
    bot.sendMessage(chatId, `${image} 아래 링크를 클릭해보세요   ${link}`);
  }
});

let status = false;

bot.on("message", (msg) => {
  if (msg.text == "번역해") {
    status = true;
  }
  if (msg.text == "번역하지마") {
    status = false;
  }
  if (status) {
    const chatId = msg.chat.id;
    const trans = msg.text;

    const NAVER_CLIENT_ID = process.env.ID;
    const NAVER_CLIENT_SECRET = process.env.SECRET;

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
        const rst = JSON.parse(body);
        let match = rst.message.result.translatedText;

        bot.sendMessage(chatId, match);
      } else {
        console.log("error = " + response.statusCode);
      }
    });
  }
});
