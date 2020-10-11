const mongoose = require('mongoose')

// DEFINE TASK SCHEMA
const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  /* exactly the same as the collection name declared in model creation */
    }
},{
    timestamps: true
})
// CREATE TASK MODEL
const Task = mongoose.model('Task', taskSchema)
module.exports = Task