const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    phone: {type: String,required:true,unique:true},
    role: {type: String, enum: ['admin','user'], default:'user'},
    otp: {type: String},
    otpExpires: {type: Date},
})

module.exports = mongoose.model('User', userSchema);