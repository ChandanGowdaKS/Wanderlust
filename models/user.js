const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoosePkg = require("passport-local-mongoose");
const passportLocalMongoose = passportLocalMongoosePkg.default || passportLocalMongoosePkg;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

// pbkdf2 hashing algorithm