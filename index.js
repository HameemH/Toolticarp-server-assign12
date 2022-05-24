const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stwgp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect()
        const ProductsCollection = client.db("Manufacturer").collection("Products");
        const ordersCollection = client.db("Manufacturer").collection("orders");
        const usersCollection = client.db("Manufacturer").collection("Users");
        const reviewsCollection = client.db("Manufacturer").collection("reviews");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = ProductsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
          });
          app.get('/products/:id', async(req,res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await ProductsCollection.findOne(query);
            res.send(result)
        })
        app.post('/orders', async(req,res)=>{
            const order =req.body;
            const addOrder = await ordersCollection.insertOne(order)
            res.send(addOrder)

        })
        app.get('/users/:email', async (req,res)=>{
            const email =req.params.email;
            const query ={userEmail:email};
            const user = await usersCollection.findOne(query);
            console.log(user);
            res.send(user)
        })
        app.post('/reviews', async(req,res)=>{
          const review = req.body;
          console.log(req.body);
          const addReview = await reviewsCollection.insertOne(review);
          res.send(addReview)
        })
        app.put('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const user = req.body;
            console.log(user);
            const filter = { userEmail: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Hello From manufacturer!')
  })
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })