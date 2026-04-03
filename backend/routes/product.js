const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const Order = require('../models/Order');

const upload = multer({ dest: 'uploads/' })

// search API
router.get('/search', async (req, res) => {
    try {
        const q = req.query.q?.trim();

        if (!q) {
            return res.json([]);
        }
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        });
        
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: 'Search error', err })
    }
})

//GET: list
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();

//         res.status(200).json(products)
//     } catch (err) {
//         res.status(500).json({ message: 'An error occured', err })
//     }
// })

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;

        let filter = {};

        if (query) {
            filter = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(filter);

        res.status(200).json(products);

    } catch (err) {
        res.status(500).json({ message: 'Error', err });
    }
});

//GET: list-item //get by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('GET BY ID ERROR:', err.message);
        res.status(500).json({ message: 'An error occured', err })
    }
})

//POST: create
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const product = new Product({
            id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        const savedProduct = await product.save();

        res.status(200).json(savedProduct);
        
    } catch (err) {
        res.status(500).json({ message: 'An error occured', err })
    }
})

//order api
// router.post('/order', async (req,res)=>{
//     try {
//         const {items, customer, pricing} = req.body;

//     // updte stock
//         for (const item of items) {
//             const quantity = Number(item.quantity);
//             if (!quantity || isNaN(quantity)) {
//                 return res.status(400).json({
//                     message:'Invalid Quantity'
//                 })
//             }
//             const product = await Product.findById(item.productId);

//             if(!product)  {
//                 return res.status(404).json({message:'Product Not Found'});
//             }

//             // check stock
//             if (product.stock < quantity) {
//                 return res.status(400).json({
//                     message: `${product.name} out of stock`
//                 });
//             }

//             //update stock saftly
//             await Product.findByIdAndUpdate(
//                 item.productId,
//             {
//                 $inc: {stock: -quantity}
//             });

//             //reduce stock
//             // product.stock -= item.quantity;
//             // await product.save();
//         }

//         const newOrder = new Order({
//             customer,
//             items,
//             pricing
//         });

//         await newOrder.save();
        
//         res.status(200).json({message:'order placed succesfully'})
//     } catch (err) {
//         console.log('order error', err);
//         res.status(500).json({message:'order failed', err})
//     }
// })

//PUT: update
router.put('/:id', multer().none(), async (req, res) => {
    try {
        const id = req.params.id;
        delete req.body._id;
        delete req.body.id;
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        console.log('UPDATED:', updateProduct);

        res.status(200).json(updateProduct);
    } catch (err) {
        console.error('update error', err.message)
        res.status(500).json({ message: 'An error occured', err })
    }
})

//DELETE: delete
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteProduct = await Product.deleteOne({ _id: id })

        res.status(200).json(deleteProduct);
    } catch (err) {
        res.status(500).json({ message: 'An error occured', err })
    }
})

module.exports = router;