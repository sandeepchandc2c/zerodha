const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    token: String,
    name: String,
    key: String,
    email: {
        type: String,
        unique: true
    }
})


module.exports = User = mongoose.model("user", UserSchema)