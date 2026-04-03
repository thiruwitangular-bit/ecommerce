const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    status: {
    type: String,
    default: 'Placed'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema)