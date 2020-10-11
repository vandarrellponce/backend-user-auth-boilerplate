const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const authMiddleware = require('../middlewares/authMiddleware')
const multer = require('multer')

// CREATE USER
router.post('/users', async(req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

// SIGNIN USER
router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(err){
        res.status(404).send(err.message)
    }
})

// LOGGING OUT USER
router.post('/users/logout', authMiddleware, async(req, res) => {
    try{
        // Delete the token from the user's array of tokens
        req.user.tokens = req.user.tokens.filter( token => token.token !== req.token)
        await req.user.save()
        res.send('User sucessfuly logged out')
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// LOG OUT ALL SESSIONS
router.post('/users/logoutall', authMiddleware, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send('Logged out from all sessions')
    } 
    catch (error) {
        res.status(500).send(e.message)
    }
    
})

// GET ALL USERS
router.get('/users', authMiddleware, async(req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// GET USER PROFILE
router.get('/users/me', authMiddleware, (req, res) => {
    res.send(req.user)
})

// UPDATE USER 
router.patch('/users/me', authMiddleware, async(req, res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) return res.status(400).send({error: 'Updating invalid field is not allowed!'})

    try{
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        /* const user = await User.findByIdAndUpdate(id, req.body, {
            new: true, 
            runValidators: true
            }) */
        res.send(user)
    }
    catch(e){
        res.status(500).send('s')
    }
})

// DELETE A USER BY ID
router.delete('/users/me', authMiddleware, async(req, res) => {
    
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// multer middleware with limits and file filters
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Allowed files are jpg, jpeg and png only'))
        }
        cb(undefined, true)
    }
})

// POST USER AVATAR
router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async(req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, 
// Handle uncaught errors
(error, req, res, next) => {
    res.status(400).send({error:error.message})
})

// GET USER AVATAR BY ID
router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()        
    }
})
// DELETE USER AVATAR
router.delete('/users/me/avatar', authMiddleware, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
})

module.exports = router