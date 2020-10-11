// CRUD create read update delete, Inserting Document without the mongoose model

const mongodb = require('./mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = `mongodb+srv://darrell:admin12345@cluster0.kimqq.mongodb.net/`

MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {

    if(err) return console.log('Unable to connect to database!')

    console.log('Database connected!')

    const db = client.db('TaskDB')
    // CREATE
    // Inserting one document to TaskDB database, users collection:
   /*  db.collection('temp-users').insertOne({
        name: 'Darrell',
        aga: 29
    }) */
    // Inserting multiple document to same db and collection:
   /*  db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 28
        }, {
            name:'Gunther',
            age:27
        }
    ], (err, result) => {
        if(err) return console.log('Unable to insert document!')
        console.log(result.ops)
    }) */
    // READ
    // Query one document
  /* db.collection('users').findOne({name:'Jen'}, (err, doc) => {
      if(err) return console.log(err)
      console.log(doc)
  }) */
    // Query multiple documents (returns a cursor)
/*   db.collection('users').find({age: 27}).toArray((err, docs) => {
      if (err) return console.log(err)
      console.log(docs)
  })

  db.collection('users').find({age: 27}).count((err, count) => {
    if (err) return console.log(err)
    console.log(count)
}) */
    // UPDATE
    // Updating one document using $set
/*     db.collection('users').updateOne({name: 'Jen'}, {
        $set:{
            name: 'Mike'
        }
    })
    .then((result) => console.log(result))
    .catch((err) => console.log(err)) */
    // Updating document using $inc
   /*  db.collection('users').updateOne({name: 'Gunther'}, {
        $inc:{
            age: 1
        }
    })
    .then(result => console.log(result))
    .catch(err => console.log(err)) */
    // Updating multiple document
/*     db.collection('tasks').updateMany({completed: false}, {
        $set:{
            completed:true
        }
    })
    .then(result => console.log('updated'))
    .catch(err => console.log(err)) */

    // DELETE
    // Deleteing multiple document
    db.collection('users').deleteMany({age:29})
    .then(result => console.log(result))
    .catch(err => console.log(err))

})