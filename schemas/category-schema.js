const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({

    categoryOne: {
        type: String
    },

    categoryTwo: {
        type: String
    },

    categoryThree: {
        type: String
    },
    flag: {
        type: String
    }
})

module.exports = mongoose.model('cats', categorySchema)