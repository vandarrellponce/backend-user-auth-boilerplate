const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const Task = require('./task')


// DEFINE USER SCHEMA
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if (value < 0) throw new Error('Age must be a positive number')
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid Email Address')
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('Password must not contain the word password')

        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})
// SET UP VIRTUAL PROPERTY FOR USER
userSchema.virtual('tasks', {
    ref: 'Task',
    localField:'_id',
    foreignField:'user'
})

// SET UP A STATIC FUNCTION FOR USER MODEL
userSchema.statics.findByCredentials = async(email, password) => {

    const user = await User.findOne({email})
    if(!user) throw new Error('Email address is incorrect')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Password is incorrect')

    return user
}
// SET METHOD FOR USER INSTANCE
/* Generate Auth token from jsonwebtoken */
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign( {_id: user._id.toString()}, 'secretkey', {expiresIn: '1 day'} )
    
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}
/* Override toJSON method of a user - TO HIDE PASSWORD AND TOKEN */
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// SET UP MIDDLEWARE FOR USERSCHEMA
/* Hash user password before saving to database */ 
userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8) 
    next()
})
/* Delete user tasks when user is removed */
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({user: user._id})
    next()
})

// CREATE USER MODEL
const User = mongoose.model('User', userSchema)


module.exports = User;