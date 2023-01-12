const chatBot = require('./CRUD_ori.js')
const main = async () => {
    // const _data = {
    //     "key": "휘인",    //아이유
    //     "text": "휘인 대 존예",   //아이유 이쁘다
    //     "url": "https://cafe.daum.net/mamamoo",    //링크
    //     "albumId": "AgACAgUAAxkBAANmY79UOa2sfqYq5Jr82iv4oRVAcYIAAqG0MRsWwPhVDeQDJA-JZtEBAAMCAANtAAMtBA"  //이미지
    // }
    const _data = {
        "key": "네이버",    //아이유
        "text": "네이버링크",   //아이유 이쁘다
        "url": "https://www.naver.com/",    //링크
    }
    const new_chatBot = new chatBot(_data);
    const t = await new_chatBot.save();
    console.log(t)
}

main()