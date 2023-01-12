require('dotenv').config()
const chatBot = require('./CRUD_ori.js')
const TelegramBot = require('node-telegram-bot-api');

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
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    console.log(msg)
    console.log(typeof (match[1]))
    bot.sendMessage(chatId, resp);
});
bot.onText(/\/save (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    let words, command, text, url;

    words = match[1].split(" ");
    console.log(words)
    command = words[0];

    if (words[1].includes('https://')) {
        url = words[1];
        text = '';
    } else {
        text = words[1];
        url = '';
    }
    const saveM = async (command) => {
        const _data = {
            "key": command,    //휘인
            "text": text,   //휘인 대 존예
            // "url": url,    //링크
            // "albumId": albumId  //이미지
        }
        const new_chatBot = new chatBot(_data);
        const t = await new_chatBot.save();
        console.log(t)
    }
    saveM(command);
    const updateM = async (command) => {
        const t = await chatBot.updateMany({
            key: { $eq: command }
        }, {
            // $set: { "url": "http://daum.net" }
            $set: {
                "text": text,
                "url": url,
                // "albumId": albumId
            }
        }, {
            upsert: true,
            multi: true,
            new: true
        }).lean()
        console.log(t)
    }
    updateM()
});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const caption = msg.caption;

    if (caption) {
        albumId = msg.photo[0].file_id
        const saveImage = async (caption) => {
            const _data = {
                "key": caption,
                "albumId": albumId  //이미지
            }
            const new_chatBot = new chatBot(_data);
            const t = await new_chatBot.save();
            console.log(t)
        }
        saveImage(caption);
    }

    const findM = async (command) => {
        const t = await chatBot.find(
            {
                key: { $eq: command },
            }).lean()

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
    }
    findM(text);

    console.log(msg);
});

