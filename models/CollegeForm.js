const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    pcName: String,
    pcEmail: String,
    pcPhoneNumber: String,
    collegeName:String,
 
});

module.exports = mongoose.model('CollegeFormData', FormDataSchema);
