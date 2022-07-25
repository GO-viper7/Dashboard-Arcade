const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    cost: {
        type: Number,
    },
    stock: {
        type: Number,
    },  
    category : {
        type: String,
    },
    description : {
        type: String,
    },
    premium : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('prods', productSchema)