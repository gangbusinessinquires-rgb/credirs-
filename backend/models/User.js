const mongoose = require("mongoose")

const User = new mongoose.Schema({

    discord_id: String,
    username: String,
    credits: {
        type: Number,
        default: 0
    },
    last_login: Date,
    created_at: {
        type: Date,
        default: Date.now
    }

})

module.exports =
    mongoose.model("User", User)
