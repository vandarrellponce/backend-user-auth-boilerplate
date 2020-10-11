require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// SET UP APP
const app = express()
app.use(express.json())

// SET UP MIDDLEWARE FOR APP

// SET UP ROUTER
app.use(userRouter)
app.use(taskRouter)

const port = process.env.PORT || 5010
app.listen(port, () => {
	console.log('Server is up on localhost port ' + port)
})

const multer = require('multer')
const uploadWare = multer({
	dest: 'images',
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(doc|docx)$/)) {
			return cb(new Error('Please upload a word document'))
		}
		cb(undefined, true)
	},
})

app.post('/upload', uploadWare.single('upload'), (req, res) => {
	res.send()
})
