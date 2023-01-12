const chatBot = require('./CRUD_ori.js')
const main = async () => {
    const t = await chatBot.updateMany({
        key: { $eq: '휘인' }
    }, {
        // $set: { "url": "http://daum.net" }
        $set: { "url": "https://cafe.daum.net/mamamoo" }
    }, {
        upsert: true,
        multi: true,
        new: true
    }).lean()
    console.log(t)
}
main()