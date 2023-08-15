const mongoose = require('mongoose')

let reviewShceme = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    value:{
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    text: {
        type: String
    }
})

let itemScheme = mongoose.Schema({
    title: String,
    img: Array,
    price: Number,
    description: String,
    characteristics: Array,
    rating: {
        type: [reviewShceme],
        default:[]
    },
    url: String
})


let Item = mongoose.model("Item", itemScheme)

module.exports = Item;