const mongoose = require('mongoose');

const ProductSchems = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
    }
)

const Product = mongoose.model('Product',ProductSchems);
module.exports = Product;