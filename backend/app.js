require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
const mongoose = require('mongoose');


app.use(cors());
app.use('/uploads', express.static('uploads'));


//enable json parser
app.use(express.json());

//route the product API
const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);

// route the order API
const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

// route Auth 
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/',(req,res)=>{
    res.send("Welcome to Ecommerce API!.")
})

app.listen(process.env.port || port,(error)=>{
    if(!error) {
        console.log('Server is running successfully!! at',port)
    } else {
        console.log('an error occured', error)
    }
});

main().catch((error)=>console.log(error));

async function main() {
    // prepare connction string
    const connectionString = 'mongodb://thiruwitangular:Thiya$2013@ac-vhulc3v-shard-00-00.6g17llc.mongodb.net:27017,ac-vhulc3v-shard-00-01.6g17llc.mongodb.net:27017,ac-vhulc3v-shard-00-02.6g17llc.mongodb.net:27017/MRTproducts?ssl=true&replicaSet=atlas-12ctsw-shard-0&authSource=admin&appName=Cluster1'
    await mongoose.connect(connectionString);
    mongoose.set('strictQuery', true);
// console.log("DB Name:", mongoose.connection.name);
// console.log("Collection:", mongoose.connection.collections);
}

