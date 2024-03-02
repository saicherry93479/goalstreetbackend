const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    college:String,
    passOut:Number,
    domain:String,
    secondDomain:String
});

module.exports = mongoose.model('FormData', FormDataSchema);
