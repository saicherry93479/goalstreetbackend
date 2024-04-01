const mongoose = require('mongoose');

const HrFormDataSchema = new mongoose.Schema({
    hrName: String,
    hrEmail: String,
    hrNumber: String,
    company:String,
    industry:String,
    companySize:Number,
    access:{
        type:Boolean,
        default:false
    
    }
});

module.exports = mongoose.model('HrFormData', HrFormDataSchema);
