const mongoose = require('mongoose')

let itemId = mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    amount:{
        type: Number,
        default: 1
    }
})

let userScheme = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    boughtItems: {
        type: [itemId],
        default: []
    }
})

let User = mongoose.model("User", userScheme)

module.exports = User;