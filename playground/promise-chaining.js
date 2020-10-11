const User = require('../src/db/models/User')
require('../src/db/mongoose')

// Chain Promises - 
// 1. Get user by ID and update age to 1
// 2. Get count of all users with age 1

/* User.findByIdAndUpdate('5f23aec86e70ef245c6a8083', { age:1 })
.then(user => {
    console.log(user)
    return User.countDocuments({ age:1 })
})
.then(count => {
    console.log(count)
}) */

// Promise Chaining using async await

const updateAgeAndCount = async(id, age) => {
    try{
        const user = await User.findByIdAndUpdate(id, { age: 1})
        const count = await User.countDocuments({age: 1})
        return count
    }
    catch(e){
        console.log(e)
    }   
}

updateAgeAndCount().then(value => console.log(value))