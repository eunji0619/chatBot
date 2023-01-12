const { mongoose, Photo } = require('./DB_CRUD.js')
const main = async () => {
  const _data = {
    albumId: 12010,
    id: 12010,
    title: '큰돌',
    url: 'yjkko48@naver.com',
    thumbnailURL: 'https://via.placeholder.com/150/13454b'
  }
  const new_photo = new Photo(_data)
  const t = await new_photo.save()
  console.log(t)
}
main()
