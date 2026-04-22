const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId:{type:String, unique:true},
    customer: {
        name: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        state: String,
        zipcode: String
    },

    items: [
        {
            productId: {type:mongoose.Schema.Types.ObjectId, ref:'Product'},
            quantity: Number
        }
    ],

    pricing: {
        subtotal: Number,
        tax: Number,
        shipping: Number,
        total: Number
    },

    paymentMethod: {
        type: String,
        enum: ['COD','Razorpay'],
        default: 'COD'
    },
    paymentStatus: {
    type: String,
    default: 'Ordered'
    },
    paymentId: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema)