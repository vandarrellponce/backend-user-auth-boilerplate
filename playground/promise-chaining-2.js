const Task = require('../src/db/models/Task')
require('../src/db/mongoose')

// Challenge 

Task.findByIdAndRemove('5f2421c66b646c54cc4392fd')
.then(task => {
    console.log('removed task')
    return Task.countDocuments({completed: false})
})
.then(count => {
    console.log(count)
})
