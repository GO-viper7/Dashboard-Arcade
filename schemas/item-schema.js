const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    id : {
        type: Number,
    },
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    category : {
        type: String,
    },
    description : {
        type: String,
    },
    premium : {
        type: Boolean,
    }
})

module.exports = mongoose.model('items', itemSchema)