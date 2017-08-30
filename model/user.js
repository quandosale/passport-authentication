var mongoose = require('mongoose');
var ObjectID = mongoose.SchemaTypes.ObjectId;

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String
});

var Model = module.exports = mongoose.model('User', userSchema);