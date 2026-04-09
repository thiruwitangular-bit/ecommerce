const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'receipt_' + Date.now()
        }
        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Razorpay Order Failed' })
    }
})

router.get('/', (req, res) => {
    res.send('Payment API working');
});

//Razorpay - verify payment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing Fields' })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET?.trim())
            .update(sign)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return res.json({ success: true });
        } else {
            res.status(400).json({ message: 'Invalid Signature' })
        }

    } catch (err) {
        res.status(500).json({ message: 'Verification Failed' });
    }
})

module.exports = router;