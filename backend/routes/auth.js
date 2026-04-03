const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// for OTP sending
router.post('/send-otp', async (req,res)=>{
    const {phone} = req.body;

    if(!phone) return res.status(400).json({messge:'phone Number required'});

    try {
        let user = await User.findOne({phone});
        if (!user) {
            // for new user, create with default role
            user = await User.create({phone})
        }

        //generate 6 digit OTP
        const otp = Math.floor(100000+Math.random()*900000).toString();

        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        //todo send otp via sms provier
        console.log(`otp for ${phone}: ${otp}`) // for testing
        res.status(200).json({message:'OTP send successfully'})
    } catch (err) {
        console.log(err);
        res.status(500).json({message:'server error'})
    }
})

//verify - OTP
router.post('/verify-otp', async (req,res)=>{
    const {phone,otp} = req.body;

    if (!phone || !otp) return res.status(400).json({message:'phone & otp required'});

    try {
        const user = await User.findOne({phone});

        if (!user) return res.status(404).json({message:'user not found!'});
        if (user.otp !== otp) return res.status(401).json({message:'Invalid OTP'});
        if (user.otpExpires < new Date()) return res.status(401).json({message:'OTP Expired'})

            // otp verified - generate JWT
            const token = jwt.sign(
                {id:user._id, role:user.role},
                process.env.jwt_SECRET,
                { expiresIn: '1d' } // string format OR number in seconds

            );
            // clear otp after successful login
            user.otp = null
            user.otpExpires = null;
            await user.save();

            res.json({token,role:user.role,phone:user.phone});
    } catch (err) {
        console.error('VERIFY OTP ERROR:', err);
        res.status(500).json({message:'server error', err})
    }
});

module.exports = router;