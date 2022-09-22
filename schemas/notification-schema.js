const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({

    userId: {
        type: String
    },
    notification: {
        type: String
    },
    time: {
        type: Number
    }
})

module.exports = mongoose.model('notifs', notificationSchema)