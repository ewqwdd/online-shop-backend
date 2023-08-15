const mongoose = require('mongoose')

let basketScheme = mongoose.Schema({
    username: {
        type: String,
        ref: 'User'
      },
    items: [
      {item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      amount: {
        type:Number,
        default:1
      }    
    }]
})

let Basket = mongoose.model("Basket", basketScheme)

module.exports = Basket;