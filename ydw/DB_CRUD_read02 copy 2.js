const { mongoose, Todo } = require('./p예제_mongoose_CRUD.js')
const main = async () => {
  const t = await Todo.findOne({
    $and: [
      {
        completed: true
      },
      {
        id: {
          $gte: 30
        }
      }
    ]
  }).lean()
  console.log(t)
}
main()
