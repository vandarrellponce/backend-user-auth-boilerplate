const Task = require('../models/task')
const express = require('express')
const router = new express.Router()
const authMiddleware = require('../middlewares/authMiddleware')



// CREATE TASK
router.post('/tasks', authMiddleware, async(req, res) => {
    try{
        const newTask = new Task({
            ...req.body, 
            user:req.user._id
        })
        const task = await newTask.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// GET ALL TASKS
// Queries: /tasks?completed=true
//          /tasks?limit=10&skip=10
//          /tasks?sortBy=createdAt_desc
router.get('/tasks', authMiddleware, async(req, res) => {
    
    const match = {}
    const sort = {}
    if(req.query.completed) match.completed = req.query.completed === 'true'
    if(req.query.sortBy){
        const sortByValue = req.query.sortBy.split('_')[0]
        const orderByValue = req.query.sortBy.split('_')[1] === 'desc' ? -1 : 1
        sort[sortByValue] = orderByValue
    }
    try{
        const user = await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: Number(req.query.limit),
                skip: Number(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(user.tasks)

        /* const tasks = await Task.find({user: req.user._id})
        res.send(tasks) */
    }
    catch(e){
        res.status(500).send(e)
    }
})

// GET TASK BY ID
router.get('/tasks/:id', authMiddleware, async(req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, user: req.user._id})
        if(!task) return res.status(404).send()
        res.send(task)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// UPDATE TASK BY ID
router.patch('/tasks/:id', authMiddleware, async(req, res) => {

    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({error: 'Invalid update operation'})

    try{
        const task = await Task.findOne({_id, user: req.user._id})
        if(!task) return res.status(404).send()
        updates.forEach( update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// DELETE TASK BY ID
router.delete('/tasks/:id', authMiddleware, async(req, res) => {
    const _id = req.params.id
    try{
        const deletedTask = await Task.findOneAndDelete({_id, user: req.user._id})
        if(!deletedTask) return res.status(404).send()
        res.send(deletedTask)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router