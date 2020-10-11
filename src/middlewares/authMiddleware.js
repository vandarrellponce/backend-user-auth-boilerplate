const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async(req, res, next) => {
   try{
        // Retrieve token from the header 
        const token = req.header('Authorization').replace('Bearer ', '')

        // Decode the token if it is still valid
        const decoded = jwt.verify(token, 'secretkey')

        // If token is valid, find the user with _id in the tokens payload
        // and check if that token is still in the user's tokens array 
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) throw new Error('Invalid token')

        // Can also attach the user to the request method
        req.token = token
        req.user = user
        next()
   }
   catch(e){
        res.status(401).send({error:'Please authenticate.', message: e.message})
   }
}

module.exports = authMiddleware  