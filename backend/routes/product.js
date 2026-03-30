const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' })

//GET: list
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: 'An error occured', err })
    }
})

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
            price: req.body.price,
            stock: req.body.stock,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        const savedProduct = await product.save();

        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: 'An error occured', err })
    }
})

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