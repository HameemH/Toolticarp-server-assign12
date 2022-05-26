const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
          app.post('/products', async(req,res)=>{
            const product =req.body;
            const addProduct = await ProductsCollection.insertOne(product)
            res.send(addProduct)
          })
          app.get('/products/:id', async(req,res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await ProductsCollection.findOne(query);
            res.send(result)
        })
        app.delete('/products/:id', async(req,res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await ProductsCollection.deleteOne(query);
          
          res.send(result);
        })
        app.post('/orders', async(req,res)=>{
            const order =req.body;
            const addOrder = await ordersCollection.insertOne(order)
            res.send(addOrder)

        })
        
        app.get('/orders', async (req, res) => {
          
          const query = {}
          const cursor = ordersCollection.find(query);
          const orders = await cursor.toArray();
          res.send(orders);
        });
        app.get('/orders', async (req, res) => {
          const email = req.query.email;
          const query = {email:email}
          const cursor = ordersCollection.find(query);
          const orders = await cursor.toArray();
          res.send(orders);
        });
        app.delete('/orders/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await ordersCollection.deleteOne(query);
          
          res.send(result);
      })
        app.get('/orders/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await ordersCollection.findOne(query);
          
          res.send(result);
      })
        app.get('/users/:email', async (req,res)=>{
            const email =req.params.email;
            const query ={userEmail:email};
            const user = await usersCollection.findOne(query);
            
            res.send(user)
        })
        app.post('/create-payment-intent', async(req, res) =>{
          const Order = req.body;
          const price = Order.price;
         console.log(price);
          const paymentIntent = await stripe.paymentIntents.create({
            amount : price,
            currency: 'usd',
            payment_method_types:['card']
          });
          res.send({clientSecret: paymentIntent.client_secret})
        });
        app.get('/users', async (req,res)=>{
            
            const query ={};
            const cursor = usersCollection.find(query)
            const users = await cursor.toArray();
            
            res.send(users)
        })
        app.post('/reviews', async(req,res)=>{
          const review = req.body;
          console.log(req.body);
          const addReview = await reviewsCollection.insertOne(review);
          res.send(addReview)
        })
        app.get('/reviews',async(req,res)=>{
          const query ={};
          const cursor = reviewsCollection.find(query);
          const reviews = await cursor.toArray();
          res.send(reviews)
        })
        app.put('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const user = req.body;
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