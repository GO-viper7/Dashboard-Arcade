const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    Inventory: {
        type: [],
    },
})

module.exports = mongoose.model('Invi', inventorySchema)