const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

//create Order
router.post('/', async (req, res) => {
    try {
        const { items, customer, pricing } = req.body;

        //validate Items
        for (const item of items) {
            const quantity = Number(item.quantity);

            if (!quantity || isNaN(quantity)) {
                return res.status(400).json({ message: 'invalid quantity!' })
            }
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: 'Product Not Found' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `${product.name} out of stock`
                });
            }

            //reduce stock
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -quantity } }
            );
        }

        //save order
        const newOrder = new Order({
            customer,
            items,
            pricing
        });

        await newOrder.save();

        res.status(200).json({
            message: 'Order placed successfully',
            orderId: newOrder._id,
            order: newOrder
        });

    } catch (err) {
        console.log('order error', err);
        res.status(500).json({
            message: 'order failed',
            err
        });
    }
});

// get all orders (for admin page)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.productId')
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch orders', err
        })
    }
});

// get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId');

        if (!order) {
            return res.status(404).json({
                message: 'order not found'
            });
        }
        res.status(200).json(order)

    } catch (err) {
        res.status(500).json({ messge: 'Error fetching order!' })
    }
});

//update order status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(updated)

    } catch (err) {
        res.status(500).json({ message: 'update Failed!', err })
    }
});

//delete order
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'successfully order deleted' })

    } catch (err) {
        res.status(500).json({ message: 'Delete Failed!' })
    }
});

module.exports = router;
