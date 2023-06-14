const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());





const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2'

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