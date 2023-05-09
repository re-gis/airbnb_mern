const mongoose = require("mongoose");
const userModel = mongoose.Schema;
const UserSchema = new userModel({
    name: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('User', UserSchema)
