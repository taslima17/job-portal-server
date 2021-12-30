const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ppycm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("job-portal");
    const jobCollections = database.collection("jobs");
    console.log('db-connected');

    // create job
    app.post('/jobs', async (req, res) => {
      const data = req.body;
      console.log(data)
      const result = await jobCollections.insertOne(data)
      res.json(result)
    })
    app.get('/jobs', async (req, res) => {
      const result = await jobCollections.find({}).toArray();
      res.send(result);
    })
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await jobCollections.findOne(query);
      res.send(result)
    })
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await jobCollections.deleteOne(query);
      console.log(result)
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('hello')
  res.send('hello there')
})
app.listen(port, () => {
  console.log('listening port', port);
})