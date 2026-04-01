const mongoose = require("mongoose")

const Server = new mongoose.Schema({

    discord_id: String,
    ptero_server_id: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    }

})

module.exports =
    mongoose.model("Server", Server)
