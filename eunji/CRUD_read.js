const chatBot = require('./CRUD_ori.js')

const main = async () => {
    const t = await chatBot.find(
        {
            key: { $eq: "휘인" },
        }).lean()
    // console.log(t)
    console.log(t[0].albumId)

}
main()