const mongoose = require('mongoose')
const connectionURL = `mongodb+srv://darrell:admin12345@cluster0.kimqq.mongodb.net/ztask-manager?retryWrites=true&w=majority
`

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(client => console.log('Database connected'))
.catch(err => console.log(err))


