const mongoose = require('mongoose')
const Oyun = mongoose.Schema({
    sunucu: String,
    user: String,
    coin: { type: Number, default: 0 },
    coinTime: {type: Number, default: 0},
})
module.exports = mongoose.model("Oyun", Oyun);