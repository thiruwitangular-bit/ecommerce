const { default: mongoose } = require("mongoose");

const counterSchema = new mongoose.Schema({
    date: String,
    seq: Number
})

const Counter = mongoose.model('Counter', counterSchema);

const getNextOrderid = async ()=>{
    const today = new Date().toISOString().slice(0,10).replace(/-/g,'');

    const counter = await Counter.findOneAndUpdate(
        {date: today},
        {$inc: {seq:1}},
        {new: true, upsert: true}
    );
    const serial = String(counter.seq).padStart(3,'0');

    return `${today}-${serial}`;
}