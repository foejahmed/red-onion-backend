const express=require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const app=express();

app.use(cors())
app.use(bodyParser.json())

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });


//database connection
// const uri = process.env.DB_PATH;
// let client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("restaurant").collection("foodItems");   
// });


app.get("/fooditems", (req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true },{ useUnifiedTopology: true });

    client.connect(err=>{
        const collection = client.db("restaurant").collection("foodItems");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message: err})
            }
            else{
                // console.log("sucessfully inserted", result)
                res.send(documents)
            }
        })
        client.close();
    })
})

app.post('/addfood', (req,res)=>{
    const product= req.body
    let uri = process.env.DB_PATH;
    client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("restaurant").collection("foodItems");
        collection.insert(product, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message: err})
            }
            else{
                // console.log("sucessfully inserted", result)
                res.send(result.ops[0])
            }
        })     
    });
})

app.get('/fooditems/:key', (req,res)=>{
    const key= req.params.key
    client = new MongoClient(uri, { useNewUrlParser: true },{ useUnifiedTopology: true });

    client.connect(err=>{
        const collection = client.db("restaurant").collection("foodItems");
        collection.find({key: key}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message: err})
            }
            else{
                // console.log("sucessfully inserted", result)
                res.send(documents[0])
            }
        })
        client.close();
    })
})

app.post("/getFoodsByKey", (req,res)=>{
    const key= req.params.key;
    const productKeys= req.body;
    console.log(productKeys)

    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err=>{
        const collection = client.db("restaurant").collection("foodItems");
        collection.find({key: {$in: productKeys}}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message: err})
            }
            else{
                // console.log("sucessfully inserted", result)
                res.send(documents)
            }
        })
        client.close();
    })
})

app.post("/placeOrder", (req,res)=>{
    // console.log("data received ", req.body);
    //save to database
    const orderDetails= req.body;
    orderDetails.orderTime= new Date()

    console.log(orderDetails);
    // console.log(product);

    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err=>{
        const collection = client.db("restaurant").collection("orders");
        collection.insertOne(orderDetails, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message: err})
            }
            else{
                // console.log("sucessfully inserted", result)
                res.send(result.ops[0])
            }

        })
    })
})

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('listening to port 4200'));