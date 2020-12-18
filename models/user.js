const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        validate: [validateEmail, 'Please fill in a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill in a valid email address']
    }
})



UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);