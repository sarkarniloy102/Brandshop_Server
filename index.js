const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.mypgnvz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const productCollection = client.db('productDB').collection('product');
        const userCollection = client.db('productDB').collection('user');
        const brandCollection = client.db('brandDB').collection('brand');
        const cartCollection = client.db('cartDB').collection('cart');

        app.get('/addproduct', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            console.log("data is :", result)
            res.send(result);
        })

        app.get("/brand/:brandName", async (req, res) => {
            const brand_name = req.params.brandName; // Capture the brandName parameter
            const query = {
                brand: brand_name,
            };
            const result = await productCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        });



        app.post('/addproduct', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.post('/mycart', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await cartCollection.insertOne(newProduct);
            res.send(result);
        })






    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('entertainment server is running')
})

app.listen(port, () => {
    console.log(`product server is running on port: ${port}`);
})