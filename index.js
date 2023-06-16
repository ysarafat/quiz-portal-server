const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());





// const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2'
const uri =  `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.0`

// mongodb
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
 
    await client.connect();
    const quizCategoryCollection = client.db('quizDB').collection('category')
    const quizCollection = client.db('quizDB').collection('quiz')
    const usersCollection = client.db('quizDB').collection('users')
    const scoreCollection = client.db('quizDB').collection('score')

    // save user in db
    app.post('/user', async(req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    // get  user from db
    app.get('/user', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    // save quiz category in db
    app.post('/add-category', async(req, res) => {
      const categoryData = req.body;
      const result = await quizCategoryCollection.insertOne(categoryData);
      res.send(result)
    })

    // get quiz category from db
    app.get('/quiz-category', async(req,res) => {
      const result = await quizCategoryCollection.find().toArray();
      res.send(result)
    })

    // save quiz to db
    app.post('/add-quiz', async(req, res) => {
      const categoryData = req.body;
      const result = await quizCollection.insertOne(categoryData);
      res.send(result)
    })

    // get quiz from db
    app.get('/quiz', async(req,res) => {
      const category = req.query.name;
      const query = {quizCategory: category}
      const result = await quizCollection.find(query).toArray();
      res.send(result)
    })
    // save quiz score 
    app.post('/quiz-score', async(req, res) => {
      const body = req.body;
      const result = await scoreCollection.insertOne(body)
      res.send(result);
    })

    // get all quiz score  for leaderboard
    app.get('/score', async(req, res) => {
      const result = await scoreCollection.find().sort({score: -1}).toArray();
      res.send(result);
    })
    
    // get user score 
    app.get('/my-score', async(req,res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await scoreCollection.find(query).toArray();
      res.send(result)
    })
  
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);



// server listening 
app.listen(PORT, ()=> {
    console.log(`quiz server running on ${PORT} port`)
})