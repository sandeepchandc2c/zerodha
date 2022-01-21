const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    token: String
})


module.exports = User = mongoose.model("user", UserSchema)