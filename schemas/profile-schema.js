const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    OctaCreds: {
        type: Number,
        default: 0,
    },
    Passive: {
        type: Number,
        default: 0
    },
    twitter: {
        type: String
    },
    twitterName: {
        type: String
    },
    wallet: {
        type: String
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    gender: {
        type: String
    },
    country: {
        type: String
    },
    zipCode: {
        type: String
    },
    houseNumber: {
        type: String
    },
    city: {
        type: String
    },
    streetName: {
        type: String
    },
})

module.exports = mongoose.model('profiles', profileSchema)