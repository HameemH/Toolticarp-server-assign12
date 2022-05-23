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